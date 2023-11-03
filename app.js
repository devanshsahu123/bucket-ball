const express = require('express')
const app = express();
const router = require('./routes/bucketBallRouter.js')



//use dotEnv;
require('dotenv').config()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//use router
app.use('/', router)

const port = process.env.PORT || 3001

app.listen(port,()=>{
    console.log(`server is listen at http://localhost:${port}`);
})