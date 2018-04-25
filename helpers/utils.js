const utils = module.exports;

const fs = require('fs');
const AES = require('crypto-js/aes');
const config = require('../config');

utils.readFileContent = filePath => new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) {
            reject(err);
        } else {
            resolve(content);
        }
    });
});

utils.removeFile = filePath => new Promise((resolve, reject) => {
    fs.unlink(filePath, err => {
        if (err) {
            reject(err);
        } else {
            resolve();
        }
    });
});

utils.encryptContent = content => new Promise((resolve, reject) => {
    const encrypted = AES.encrypt(content, config.encrypt.key).toString();
    resolve(encrypted); 
});

utils.showError = message => {
    return {
        error: true,
        message: message
    }
};