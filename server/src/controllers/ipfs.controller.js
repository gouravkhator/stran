const { addDataToIPFS, getDataByCID } = require("../services/ipfs.service");
const { AppError } = require("../utils/errors.util");

async function addDataToIpfsController(req, res, next) {
  try {
    const data = req.body;

    if (data === undefined) {
      throw new AppError({
        shortMsg: "invalid-data-input",
        message:
          "Either *data* is not provided, or it is provided as invalid data..",
        statusCode: 401,
      });
    }

    const cid = await addDataToIPFS(data);

    return res.status(201).json({
      status: "success",
      cid,
      ipfsURL: `https://ipfs.io/ipfs/${cid}`,
    });
  } catch (err) {
    if (err instanceof AppError) {
      return next(err);
    }

    return next(
      new AppError({
        message:
          "Data could not be added to IPFS.. Maybe the IPFS node is not running, please restart it if possible, and try again..",
        shortMsg: "data-not-added",
        statusCode: 500,
      }),
    );
  }
}

async function getDataFromIpfsController(req, res, next) {
  if (!req.params.cid) {
    return next(
      new AppError({
        message: "Path does not contain the data id..",
        shortMsg: "no-cid-in-params",
        statusCode: 400,
      }),
    );
  }

  try {
    let data = await getDataByCID(req.params.cid);
    return res.json({
      data,
      status: "success",
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  addDataToIpfsController,
  getDataFromIpfsController,
};
