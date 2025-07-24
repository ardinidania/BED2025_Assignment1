const sql = require("mssql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../dbConfig");

exports.login = async (req, res) => {
  const { ic, phone, pin } = req.body;

  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM Users WHERE ic = ${ic} AND phone = ${phone}`;
    let user = result.recordset[0];

    if (!user) {
      const hash = await bcrypt.hash(pin, 10);
      await sql.query`INSERT INTO Users (ic, phone, pinHash) VALUES (${ic}, ${phone}, ${hash})`;
      const newResult = await sql.query`SELECT * FROM Users WHERE ic = ${ic} AND phone = ${phone}`;
      user = newResult.recordset[0];
    } else {
      const valid = await bcrypt.compare(pin, user.pinHash);
      if (!valid) return res.status(401).json({ message: "Invalid PIN." });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login error." });
  }
};

exports.getUserProfile = async (req, res) => {
  const userId = req.userId;

  try {
    await sql.connect(config);
    const result = await sql.query`SELECT id, ic, phone FROM Users WHERE id = ${userId}`;
    const user = result.recordset[0];

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({
      userId: user.id,
      ic: user.ic,
      phone: user.phone
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving profile." });
  }
};

