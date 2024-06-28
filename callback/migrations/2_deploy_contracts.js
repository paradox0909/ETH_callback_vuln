const VulnerableAuction = artifacts.require("VulnerableAuction");

module.exports = function(deployer) {
  deployer.deploy(VulnerableAuction);
};
