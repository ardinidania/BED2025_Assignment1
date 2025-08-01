// swagger.js
const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger-output.json"; 
const endpointsFiles = ["./app.js"];

const doc = {
  info: {
    title: "Elderly Health Companion API",
    description: "API documentation for appointments, accessibility preferences, saved places, etc.",
  },
  host: "localhost:3000", 
  schemes: ["http"],
};

swaggerAutogen(outputFile, endpointsFiles, doc);
