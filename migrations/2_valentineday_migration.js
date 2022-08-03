const ValentineDay = artifacts.require('ValentineDay');

module.exports = function(deployer, network, accounts){
  deployer.deploy(ValentineDay, "Pop Corn Collection", "PCC", "ipfs://QmP4Eh7Jbwnn4ktgqtUP1BESiLRpy2FWozkUNdrYFq8m6n/");
}
