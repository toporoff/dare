const config = module.exports;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

config.express = {
    port: process.env.EXPRESS_PORT || 5000,
    ip: '127.0.0.1'
};

config.netAddress = '165.227.175.170';
config.defaultPrivateKey = 'KxDgvEKzgSBPPfuVfw67oPQBSjidEiqTHURKSDL1R7yGaGYAeYnr';
config.winNodePublicKey = 'AN3S6qJY8xdEVWoxwUXuvbQk9jg8G2Y8gt';
config.smartContractScriptHash = 'ac09adae571a06e12f1d54b6a0fe82ccf05efa8a'; // without 0x!
config.encryptKey = 'asdasd123123';
config.pastebinApiKey = '78007d6eb604c6ef7bc460ca490f3c26';