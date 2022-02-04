const { addDataToIPFS, getDataByCID, publishCaller } = require('../services/ipfs.service');
const { AppError } = require('../utils/errors.util');

async function addDataToIpfsController(req, res, next) {
    try {
        const data = req.body;

        if(data === undefined){
            // TODO: more checks will be done on server end itself,
            // when data is going to be saved to solidity smart contract
            throw new AppError({
                shortMsg: 'invalid-data-input',
                message: 'Either *data* is not provided, or it is provided as invalid data..',
                statusCode: 401
            });
        }

        const node = req.cookies.ipfsNode;

        const cid = await addDataToIPFS(node, data);

        // TODO: save cid to smart contract

        return res.status(201).send(`Content added, kindly check the path https://ipfs.io/ipfs/${cid}`);
    } catch (err) {
        if(err instanceof AppError){
            return next(err);
        }

        return next(new AppError({
            message: 'Data could not be added to IPFS',
            shortMsg: 'data-not-added',
            statusCode: 500
        }));
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
        let data = await getDataByCID(req.cookies.ipfsNode, req.params.cid);
        return res.send(data);
    } catch (err) {
        return next(err);
    }
}

async function callInitiationController(req, res, next) {
    try {
        await publishCaller(req.cookies.ipfsNode, req.body.caller);
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
