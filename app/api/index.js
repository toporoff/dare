const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const NEON = require('@cityofzion/neon-js');
const config = require('../../config');
const utils = require('../../helpers/utils');

const upload = multer({ dest: 'upload' });
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.single('file')); // 'file' - same value as at attr 'name' of an input

const addStorage = async (req, res, next) => {
    const privateKey = req.body.key.trim() || config.defaultPrivateKey;
    const uploadedFile = req.file;

    if (!uploadedFile || uploadedFile.mimetype !== 'text/html') {
        return res.json(utils.showError('Missing file or file format is not correct'));
    }

    const account = new NEON.wallet.Account(privateKey);
    const fileName = uploadedFile.originalname.replace('.html', '');
    const key = `${fileName}_dt_${Date.now()}`; //name of exploit + timestamp
    const fileContent = await utils.readFileContent(uploadedFile.path)
        .then(data => {
            utils.removeFile(uploadedFile.path)
                .catch(err => res.json(utils.showError(`Error deleting file: ${err}`)));

            return data;
        })
        .catch(err => res.json(utils.showError(`Error reading file content: ${err}`)));

    //get our balnce (needed for transaction)
    NEON.api.neonDB.getBalance('http://165.227.175.170:5000', account.address)
        .then(balance => {
            // create or intents (someone got a link for a good explanation?)
            const intents = [{
                assetId: NEON.CONST.ASSET_ID.GAS,
                value: new NEON.u.Fixed8(1),  // I gueesed this :)
                scriptHash: config.smartContract.scriptHash
            }];

            const invoke = {
                scriptHash: config.smartContract.scriptHash,
                operation: 'addStorageRequest',
                args: [
                    NEON.sc.ContractParam.string(key),
                    NEON.sc.ContractParam.string(fileContent)
                ]
            };

            // create a script from our parameters
            const sb = new NEON.sc.ScriptBuilder();
            sb.emitAppCall(invoke.scriptHash, invoke.operation, invoke.args, false);
            const script = sb.str;

            // create a transaction object
            const unsignedTx = NEON.tx.Transaction.createInvocationTx(balance, intents, script, 3, { version: 1 });

            // sing the transaction object (we write something to the blockchain!)
            const signedTx = NEON.tx.signTransaction(unsignedTx, account.privateKey);

            // convert the transaction to hx so we can send it in an query
            const hexTx = NEON.tx.serializeTransaction(signedTx);

            // send the transaction to our net
            NEON.rpc.queryRPC('http://165.227.175.170:30333', {
                method: 'sendrawtransaction',
                params: [hexTx],
                id: 1
            })
            .then(data => { 
                res.json({ message: 'Added successfully!', key: key }); 
            })
            .catch(err => { res.json(utils.showError(err.message)); });
        })
        .catch(err => {
            res.json(utils.showError(err.message));
        });
};

const getPending = (req, res) => {
    const key = req.params.key;
    const props = NEON.sc.scriptParams = {
        scriptHash: config.smartContract.scriptHash,
        operation: 'getPendingRequest',
        args: [
            NEON.sc.ContractParam.string(key),
        ],
        useTailCall: true
    };

    const vmScript = NEON.sc.createScript(props);

    // invoke the script
    NEON.rpc.Query.invokeScript(vmScript)
        .execute('http://165.227.175.170:30333')
        .then(response => {
            let result = "Not found";

            if (response.result.state === "HALT, BREAK" && !!response.result.stack["0"]) {// "HALT, BREAK" means it was ok (source?)
                // if we stacked the parameters correctly we get the result on postion 0
                // if you e.g. provided to many input paramters they get returned to you and are on pos 0, 1, ...
                const hexValue = response.result.stack["0"].value;

                result = '';
                for (var i = 0; i < hexValue.length; i += 2) {
                    result += String.fromCharCode(parseInt(hexValue.substr(i, 2), 16));
                }
            }

            res.json(result);
        })
        .catch(error => { res.json({ error: true, message: error.message }); });
};

app.post('/add-storage', addStorage);
app.get('/get-pending/:key', getPending);

module.exports = app;