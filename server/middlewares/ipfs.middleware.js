const { createIPFSNode,
    getTopicsSubsribed,
    subscribeForCallee } = require('../services/ipfs.service');

async function createIPFSNodeIfNA(req, res, next) {
    try {
        if (!req.session.ipfsNode) {
            const ipfsNode = createIPFSNode();
            req.session.ipfsNode = ipfsNode;
        }
        
        const ipfsNode = req.session.ipfsNode;

        const topicsSubscribed = await getTopicsSubsribed(ipfsNode);
        
        if (!topicsSubscribed.includes('caller')) {
            subscribeForCallee(ipfsNode);
        }

        return next();
    } catch (err) {
        return next(err);
    }
}

module.exports = {
    createIPFSNodeIfNA,
};
