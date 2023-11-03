const { body } = require('express-validator');
const { bucket, ball } = require('../models')

const creteBucketValidationRules = [
    body('name').isString().withMessage('bucket name must be String').custom(async (name) => {

        const checkBucket = await bucket.count({
            where: {
                name: name
            }
        })

        if (checkBucket == 1) throw new Error('bucket already exist')
        return true
    }),
    body('volume').isFloat().withMessage('bucket valume must be Integer')
];

const creteBallValidationRules = [
    body('name').isString().withMessage('bucket name must be String').custom(async (name) => {
        const checkBucket = await ball.count({
            where: {
                name: name
            }
        })

        if (checkBucket == 1) throw new Error('ball already exist')
        return true
    }),
    body('volume').isFloat().withMessage('ball valume must be Integer')
];

const bucketBallValidationRules = [
    body('ballId').isInt().withMessage('ball Id must be integer')
        .custom(async (balId) => {
            const checkBall = await ball.count({
                where: {
                    id: balId
                }
            });

            if (checkBall !== 1) throw new Error("ball not Exist");
            return true
        }),
    body('quantity').notEmpty().withMessage('quantity not be empty')
        .isInt({ min: 1 }).withMessage('quantity must be  integer')
];
module.exports = {
    creteBucketValidationRules,
    creteBallValidationRules,
    bucketBallValidationRules
}