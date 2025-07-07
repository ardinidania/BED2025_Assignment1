module.exports = {
  getSavedPlacesByUserId: (userId) => `
    SELECT * FROM SavedPlaces WHERE userId = ${userId};
  `,

  addSavedPlace: (userId, label, address, phone) => `
    INSERT INTO SavedPlaces (userId, label, address, phone)
    VALUES (${userId}, '${label}', '${address}', '${phone}');
  `,

  deleteSavedPlaceById: (id) => `
    DELETE FROM SavedPlaces WHERE id = ${id};
  `
};
