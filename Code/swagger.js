const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json'
const endpointsFile = ['./Endpoints.js'];

swaggerAutogen(outputFile, endpointsFile);

//code von library api