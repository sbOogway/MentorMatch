const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MentorMatch API",
      version: "1.0.0",
      description: "API documentazione per il progetto MentorMatch",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },

  // Percorso ai file con annotazioni Swagger
  apis: [
    "./src/routes/*.js",
    "./src/controllers/*.js"
  ],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = swaggerDocs;
