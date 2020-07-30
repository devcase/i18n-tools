const path = require("path");

module.exports = {
  context: __dirname,
  entry: `./src/index.js`,
  output: {
    path: path.resolve(__dirname),
    filename: "bundle.js"
  },
  resolve: {},
  module: {
    noParse: /optionalChaining.js/,
    rules: [
      {
        resourceQuery: new RegExp("locale=en-US"),
        use: {
          loader: path.resolve(
            __dirname,
            "../../../src/webpack-i18n-loader/index.ts"
          ),
          options: {
            conditions: {
              include: [path.resolve(__dirname, "src")],
              exclude: /level4/
            },
            locale: "en-US"
          }
        }
      }
    ]
  },
  mode: "development"
};
