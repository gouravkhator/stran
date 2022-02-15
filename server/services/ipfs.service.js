const ipfsClient = require('ipfs-http-client');
const { AppError } = require('../utils/errors.util');

function createIPFSNode() {
    return ipfsClient.create({ host: 'localhost', port: 5001, protocol: 'http' });
}

async function addDataToIPFS(ipfsNode, data) {
    if (ipfsNode) {
        const results = await ipfsNode.add(JSON.stringify(data));
        return results.path;
    }

    throw new AppError({
        message: "IPFS Node not created.. Please create one, before adding the data to IPFS",
        statusCode: 500,
    });
}

/**
 * Returns the data by the data id in the ipfs
 * @param {*} ipfsNode
 * @param {*} cid Public ID of the data, when it was added to IPFS
 * @returns Data when searched by CID, or throws the error for invalid cid
 */
async function getDataByCID(ipfsNode, cid) {
    try {
        const stream = ipfsNode.cat(cid);
        let data = '';

        for await (const chunk of stream) {
            // chunks of data are returned as a Buffer, convert it back to a string
            data += chunk.toString();
        }

        return data;
    } catch (e) {
        throw new AppError({
            statusCode: 404,
            message: "Data not found by provided CID!! Cannot get data by the given cid..",
            shortMsg: "invalid-cid",
        });
    }
}

async function publishCaller(ipfsNode, callerData) {
    await ipfsNode.pubsub.publish('caller', new TextEncoder(JSON.stringify(callerData)));
}

async function subscribeForCallee(ipfsNode) {
    const receiveCalleeHandler = (msg) => {
        return JSON.parse(new TextDecoder(msg));
    };

    await ipfsNode.pubsub.subscribe('caller', receiveCalleeHandler);
}

async function getTopicsSubsribed(ipfsNode) {
    return await ipfsNode.pubsub.ls();
}

async function cleanUpsIPFS(ipfsNode) {
    await ipfsNode.pubsub.unsubscribe();
}

module.exports = {
    createIPFSNode,
    addDataToIPFS,
    getDataByCID,
    publishCaller,
    subscribeForCallee,
    getTopicsSubsribed,
    cleanUpsIPFS,
};
