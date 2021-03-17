const Environment = require("jest-environment-jsdom")

module.exports = class CustomTestEnvironment extends Environment {
  async setup() {
    await super.setup()
  }
}
