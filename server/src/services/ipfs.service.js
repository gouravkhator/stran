const ipfsClient = require('ipfs-http-client');
const { AppError } = require('../utils/errors.util');

let ipfsGlobalNode = null;

function createIPFSNode() {
    return ipfsClient.create({ host: 'localhost', port: 5001, protocol: 'http' });
}

/**
 * @returns IPFS Node
 */
function getIPFSNode() {
    if (ipfsGlobalNode === null) {
        ipfsGlobalNode = createIPFSNode();
    }

    return ipfsGlobalNode;
}

async function addDataToIPFS(data) {
    const ipfsNode = getIPFSNode();

    const results = await ipfsNode.add(JSON.stringify(data));
    return results.path;
}

/**
 * Returns the data by the data id in the ipfs
 * @param {*} cid Public ID of the data, when it was added to IPFS
 * @returns Data when searched by CID, or throws the error for invalid cid
 */
async function getDataByCID(cid) {
    const ipfsNode = getIPFSNode();

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
            message: "Data not found by the provided CID!!",
            shortMsg: "invalid-cid",
        });
    }
}

async function publishData(topicName, data) {
    const ipfsNode = getIPFSNode();

    await ipfsNode.pubsub.publish(topicName, new TextEncoder().encode(JSON.stringify(data)));
}

async function subscribeForData(topicName, eventHandler) {
    // eventHandler looks like below:
    /*
    const eventHandler = (msg) => {
         const data = new TextDecoder().decode(msg.data);
         return data;
    };
    */

    const ipfsNode = getIPFSNode();

    await ipfsNode.pubsub.subscribe(topicName, eventHandler);
}

async function getTopicsSubsribed() {
    const ipfsNode = getIPFSNode();

    return await ipfsNode.pubsub.ls();
}

async function doCleanUpIPFS() {
    const ipfsNode = getIPFSNode();

    await ipfsNode.pubsub.unsubscribe();
}

module.exports = {
    createIPFSNode,
    addDataToIPFS,
    getDataByCID,
    publishData,
    subscribeForData,
    getTopicsSubsribed,
    doCleanUpIPFS,
    getIPFSNode,
};
