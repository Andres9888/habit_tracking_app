// Explicit Metro config using CommonJS to work under package "type": "module".
const { getDefaultConfig } = require("@expo/metro-config");

module.exports = getDefaultConfig(__dirname);



