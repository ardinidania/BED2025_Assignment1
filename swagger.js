// swagger.js
const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger-output.json"; // Auto-generated Swagger spec
const endpointsFiles = ["./app.js"]; // Replace with your main app file or router files

const doc = {
  info: {
    title: "Elderly Health Companion API",
    description: "API documentation for appointments, accessibility preferences, saved places, etc.",
  },
  host: "localhost:3000", // Change if using different port or deploying
  schemes: ["http"],
};

swaggerAutogen(outputFile, endpointsFiles, doc);
