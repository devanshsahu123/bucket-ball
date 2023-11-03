const bucket = require('../controllers/bucketBallController.js');
const bucketValidation = require('../validation/bucketBallValidation.js');
const handleValidationErrors = require('../validation/handleValidationErrors.js');

const router = require('express').Router();

router.post('/create-bucket',
    bucketValidation.creteBucketValidationRules,
    handleValidationErrors,
    bucket.createBucket
);

router.post('/create-ball',
    bucketValidation.creteBallValidationRules,
    handleValidationErrors,
    bucket.createBall
);

router.post('/drop-ball-bucket',
    bucketValidation.bucketBallValidationRules,
    handleValidationErrors,
    bucket.dropBalltoBucket
);

module.exports = router