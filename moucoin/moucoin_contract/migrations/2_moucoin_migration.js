const Moucoin = artifacts.require("Moucoin");

module.exports = function (deployer) {
  deployer.deploy(Moucoin);
};
