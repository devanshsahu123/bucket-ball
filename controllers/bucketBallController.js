const { bucket, ball, bucketBall, sequelize, Sequelize } = require('../models')

const createBucket = async (req, res) => {
    try {
        const { name, volume } = req.body
        await bucket.create({
            name, volume, empty: volume
        });
        return res.send({ status: true, msg: " create Bucket successfully " });
    } catch (error) {
        console.log(error);
        return res.send({ status: false, msg: "create Bucket Error !!", error });
    }
}

const createBall = async (req, res) => {
    try {
        await ball.create(req.body);
        return res.send({ status: true, msg: " create Ball successfully " });
    } catch (error) {
        console.log(error);
        return res.send({ status: false, msg: "create Ball Error !!", error });
    }
}

const dropBalltoBucket = async (req, res) => {
    try {
        const { ballId, quantity } = req.body;

        const getBallSize = await ball.findOne({
            where: {
                id: ballId
            },
            attributes: ['volume']
        });

        let requiredSpace = getBallSize.volume * quantity
        let query = 'SELECT * from buckets WHERE buckets.empty > :requiredSpace ORDER BY buckets.volume ASC limit 1'
        const [getBucket] = await sequelize.query(query, {
            replacements: {
                requiredSpace
            },
            type: Sequelize.DataTypes.SELECT
        });

        if (getBucket[0]) {

            const dropBallToBucket = await bucketBall.create({
                bucketId: getBucket[0].id,
                ballId,
                quantity
            });

            const reduceBucketSpace = await bucket.update({
                empty: getBucket[0].empty - (quantity * getBallSize.volume)
            }, {
                where: {
                    id: getBucket[0].id
                },
            })
        } else {
            throw new Error("buckets don't have enough space")
        }

        query = "SELECT id,name,volume,empty from buckets WHERE buckets.empty > (SELECT SUM(balls.volume*bucketballs.quantity) AS totalVolume FROM bucketballs INNER JOIN balls ON bucketballs.ballId = balls.id ) ORDER BY buckets.volume ASC limit 1;"

        const [BallsToOneBucketId] = await sequelize.query(query, {
            replacements: {
                requiredSpace
            },
            type: Sequelize.DataTypes.SELECT
        });

        if (BallsToOneBucketId[0]) {
            query = "insert INTO bucketballs(bucketId,ballId,quantity) SELECT  bucketballs.bucketId ,bucketballs.ballId AS ballId , SUM(quantity) AS quantity  FROM bucketballs INNER JOIN buckets ON bucketballs.bucketId = buckets.id WHERE bucketId != :bucketId GROUP BY bucketballs.ballId"
            await sequelize.query(query, {
                replacements: {
                    bucketId: BallsToOneBucketId[0].id
                },
            });

            query = "DELETE FROM `bucketballs` WHERE bucketballs.bucketId != :bucketId";
            await sequelize.query(query, {
                replacements: {
                    bucketId: BallsToOneBucketId[0].id
                }
            })
        }
        return res.send({ status: true, msg: " drop Ball successfully ", getBallSize, getBucket });
    } catch (error) {
        console.log(error);
        return res.send({ status: false, msg: error.message || "drop Ball Error !!", });
    }
}

module.exports = {
    createBucket,
    createBall,
    dropBalltoBucket
}
