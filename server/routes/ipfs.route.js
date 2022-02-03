const router = require('express').Router();
const { getDataFromIpfsController, addDataToIpfsController, callInitiationController } = require('../controllers/ipfs.controller');

router.post('/', addDataToIpfsController);

router.post('/call-init', callInitiationController);

router.get('/:cid', getDataFromIpfsController);

module.exports = router;
