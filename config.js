const config = module.exports;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

config.express = {
    port: process.env.EXPRESS_PORT || 5000,
    ip: '127.0.0.1'
};

config.smartContract = {
    scriptHash: '3bdea2ffb57a51206316ed98f3d1a4616a6632d9' // without 0x!
};

config.defaultPrivateKey = 'KxDgvEKzgSBPPfuVfw67oPQBSjidEiqTHURKSDL1R7yGaGYAeYnr';