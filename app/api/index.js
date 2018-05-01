const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const NEON = require('@cityofzion/neon-js');
const PastebinAPI = require('pastebin-js');
const config = require('../../config');
const utils = require('../../helpers/utils');

const upload = multer({ dest: 'upload' });
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.single('file'));

const addStorage = async (req, res) => {
    const privateKey = req.body.key.trim() || config.defaultPrivateKey;
    const uploadedFile = req.file;
    const netAddress = `${req.protocol}://${config.netAddress}`;

    if (!uploadedFile || uploadedFile.mimetype !== 'text/html') {
        return res.json(utils.showError('Missing file or file format is not correct'));
    }

    const account = new NEON.wallet.Account(privateKey);    
    const sourceAddress = account.address;

    let intents = NEON.api.makeIntent({GAS: "0.00000001"}, config.winNodePublicKey);
    let neonConfig = {
        net: `${netAddress}:5000`,
        address: sourceAddress,
        privateKey: privateKey,
        intents: intents
    };

    const txRes = await NEON.api.sendAsset(neonConfig);
    const key = txRes.tx.hash;
    const fileContent = await utils.readFileContent(uploadedFile.path)
        .then(data => {
            utils.removeFile(uploadedFile.path)
                .catch(err => res.json(utils.showError(`Error deleting file: ${err}`)));

            return data;
        })
        .catch(err => res.json(utils.showError(`Error reading file content: ${err}`)));

    const encryptedContent = await utils.encryptContent(fileContent);
    const pastebin = new PastebinAPI(config.pastebinApiKey);
    let pastebinUrl = '';

    await pastebin.createPaste(encryptedContent, key, null, 0, '1D')
        .then((data) => {
            pastebinUrl = data;
        })
        .catch(err => utils.showError(err));

    //Sleep because of block updates 30sec    
    await utils.sleep(30000);

    if (pastebinUrl) {
        NEON.api.neonDB.getBalance(`${netAddress}:5000`, account.address)
            .then(balance => {
                intents = [{
                    assetId: NEON.CONST.ASSET_ID.GAS,
                    value: new NEON.u.Fixed8("0.00000001"),
                    scriptHash: config.smartContractScriptHash
                }];

                const invoke = {
                    scriptHash: config.smartContractScriptHash,
                    operation: 'addStorageRequest',
                    args: [
                        NEON.sc.ContractParam.string(key),
                        NEON.sc.ContractParam.string(pastebinUrl)
                    ]
                };

                const sb = new NEON.sc.ScriptBuilder();
                sb.emitAppCall(invoke.scriptHash, invoke.operation, invoke.args, false);

                const script = sb.str;
                const unsignedTx = NEON.tx.Transaction.createInvocationTx(balance, intents, script, 0, { version: 1 });
                const signedTx = NEON.tx.signTransaction(unsignedTx, account.privateKey);
                const hexTx = NEON.tx.serializeTransaction(signedTx);

                NEON.rpc.queryRPC(`${netAddress}:30333`, {
                    method: 'sendrawtransaction',
                    params: [hexTx],
                    id: 1
                })
                    .then(data => {
                        res.json({ message: 'Added successfully!', key: key });
                    })
                    .catch(err => { 
                        res.json(utils.showError(err.message)); 
                    });
            })
            .catch(err => {
                res.json(utils.showError(err.message));
            });
    } else {
        res.json(utils.showError('Occured an error'));
    }
};

const getPending = (req, res) => {
    const key = req.params.key;
    const netAddress = `${req.protocol}://${config.netAddress}`;
    const props = NEON.sc.scriptParams = {
        scriptHash: config.smartContractScriptHash,
        operation: 'getPendingRequest',
        args: [
            NEON.sc.ContractParam.string(key),
        ],
        useTailCall: true
    };

    const vmScript = NEON.sc.createScript(props);

    NEON.rpc.Query.invokeScript(vmScript)
        .execute(`${netAddress}:30333`)
        .then(response => {
            let result = "Not found";

            if (response.result.state === "HALT, BREAK" && !!response.result.stack["0"]) {
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