import neon from '@cityofzion/neon-js';
import axios from 'axios';

import config from '../config';
import * as util from '../shared/util';

const Neon = neon.default;

export const getBalance = address => {
    return axios.get(config.RESTEndpoint + '/v2/address/balance/' + address)
        .then((res) => {
            return res.data;
        });
};

export const getRPCEndpoint = () => {
    return axios.get(config.RESTEndpoint + '/v2/network/best_node')
        .then(response => response.data.node);
};

export const queryRPC = (method, params, id = 1) => {
    return getRPCEndpoint()
        .then(rpcEndpoint => {
            return neon.rpc.queryRPC(rpcEndpoint, {
                method: method,
                params: params,
                id: id
            }).then(res => {
                return res;
            }).catch(err => {
                return err;
            })
        })
};

export const executeTransaction = (fromAccount, invoke, gasCost, intents = []) => {
    return getBalance(fromAccount.address)
        .then(balances => {
            const unsignedTx = neon.tx.Transaction.createInvocationTx(balances, intents, invoke, gasCost, { version: 1 });
            const signedTx = neon.tx.signTransaction(unsignedTx, fromAccount.privateKey);
            const hexTx = neon.tx.serializeTransaction(signedTx);

            return queryRPC('sendrawtransaction', [hexTx])
                .then(res => res);
        }).catch(error => {
            console.log(error);
        });
};

export const getScriptHash = input => {
    const hash = neon.wallet.getScriptHashFromAddress(input);

    return util.reverseHex(hash);
};

export const getAddress = input => {
    const hash = util.reverseHex(input);

    return neon.wallet.getAddressFromScriptHash(hash);
};

export const isAddress = address => neon.wallet.isAddress(address);

export const getStorage = (key, type = "hex") => {
    if (isAddress(key)) {
        key = getScriptHash(key);
    } else {
        key = util.str2hex(key);
    }

    return queryRPC('getstorage', [config.scriptHash, key])
        .then(res => {
            if (res.result) {
                if (type === "scriptHash") {
                    return getAddress(res.result);
                } else {
                    return util.hex2str(res.result);
                }
            } else {
                console.log('empty result', key);
                return false;
            }
        });
};

export const testContract = (operation, args, callback) => {
    let hexArgs = util.arr2hex(args);
    const props = {
        scriptHash: config.scriptHash,
        operation: operation,
        args: hexArgs
    };
    const vmScript = Neon.create.script(props);

    return getRPCEndpoint()
        .then(rpcEndpoint => {
            return neon.rpc.Query.invokeScript(vmScript)
                .execute(rpcEndpoint)
                .then((res) => {
                    callback(res)
                })
        });
};

export const invokeContract = (operation, args, account, callback) => {
    let hexArgs = [];

    args.forEach(arg => {
        hexArgs.push(util.str2hex(arg));
    });

    const scriptHash = config.scriptHash;
    const invoke = { operation: operation, args: hexArgs, scriptHash: scriptHash };
    const intents = [
        //   {assetId: util.ASSETS['GAS'], value: 0.00000001, scriptHash: scriptHash}
    ];
    const gasCost = 1;
    const props = {
        scriptHash: scriptHash,
        operation: operation,
        args: hexArgs
    };
    const vmScript = Neon.create.script(props);

    return getRPCEndpoint()
        .then(rpcEndpoint => {
            return neon.rpc.Query.invokeScript(vmScript)
                .execute(rpcEndpoint)
                .then((res) => {
                    if (res.result.state === 'HALT, BREAK') {
                        executeTransaction(account, invoke, gasCost, intents)
                            .then(res => {
                                if (res !== undefined) {
                                    callback(res);
                                } else {
                                    return;
                                }
                            })
                    } else {
                        console.log('Error:', res);
                    }
                });
        });
};