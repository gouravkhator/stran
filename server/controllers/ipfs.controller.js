const { addDataToIPFS, getDataByCID, publishCaller } = require('../services/ipfs.service');
const { AppError } = require('../utils/errors.util');

async function addDataToIpfsController(req, res, next) {
    try {
        const data = req.body.data;
        const node = req.session.ipfsNode;

        const cid = await addDataToIPFS(node, data);

        // TODO: save cid to smart contract

        return res.status(201).send(`Content added, kindly check the path ${req.originalUrl}${cid}`);
    } catch (err) {
        return next(err);
    }
}

async function getDataFromIpfsController(req, res, next) {
    if (!req.params.cid) {
        return next(new AppError({
            message: "Params should contain cid..",
            shortMsg: "no-cid-in-params",
            statusCode: 401
        }));
    }

    try {
        let data = await getDataByCID(req.session.ipfsNode, req.params.cid);
        return res.send(data);
    } catch (err) {
        return next(err);
    }
}

async function callInitiationController(req, res, next) {
    try {
        await publishCaller(req.session.ipfsNode, req.body.caller);
        res.status(201).send('Published caller info to the caller topic of IPFS..');
    } catch {
        return next(new AppError({
            message: "Cannot publish the caller to ipfs",
            shortMsg: "publish-err",
            statusCode: 500,
        }));
    }
}

module.exports = {
    addDataToIpfsController, getDataFromIpfsController, callInitiationController
};
