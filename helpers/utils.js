const utils = module.exports;

const fs = require('fs');
const CryptoJS = require('crypto-js');
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

utils.encryptContent = content => new Promise(resolve => {
    const encrypted = CryptoJS.RC4.encrypt(content, config.encryptKey).toString();
    resolve(encrypted);
});

utils.decryptContent = content => new Promise(resolve => {
    const decrypted = CryptoJS.RC4.decrypt(content, config.encryptKey);
    resolve(CryptoJS.enc.Utf8.stringify(decrypted));
});

utils.showError = message => {
    return {
        error: true,
        message: message
    }
};

utils.sleep = async ms => new Promise(resolve => setTimeout(resolve, ms));