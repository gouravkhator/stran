const { createIPFSNode,
    getTopicsSubsribed,
    subscribeForCallee } = require('../services/ipfs.service');

async function createIPFSNodeIfNA(req, res, next) {
    try {
        if (!req.cookies.ipfsNode) {
            const ipfsNode = createIPFSNode();
            req.cookies.ipfsNode = ipfsNode;
        }
        
        const ipfsNode = req.cookies.ipfsNode;
        
        // TODO: caller and callee subscribe
        // const topicsSubscribed = await getTopicsSubsribed(ipfsNode);
        
        // if (!topicsSubscribed.includes('caller')) {
        //     subscribeForCallee(ipfsNode);
        // }

        return next();
    } catch (err) {
        return next(err);
    }
}

module.exports = {
    createIPFSNodeIfNA,
};
