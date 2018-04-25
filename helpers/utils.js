const utils = module.exports;

const fs = require('fs');

utils.readFileContent = filePath => new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, content) => {
        if(err) {
            reject(err);
        } else {
            resolve(content);
        }
    });
});

utils.removeFile = filePath => new Promise((resolve, reject) => {
    fs.unlink(filePath, err => {
        if(err){
            reject(err);
        } else {
            resolve();
        }
    });
});

utils.showError = message => {
    return {
        error: true,
        message: message
    }
};