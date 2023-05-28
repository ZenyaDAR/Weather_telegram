require('dotenv').config()
import express from 'express'
import mongoose from 'mongoose'
import router from './router.js'
import cors from 'cors'

const port = 5001
const app = express()

const db_url = process.env.LINK_DB

app.use((req, res, next) => {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(express.json())
app.use('/api', router)
app.use(cors())



async function startApp(){
    try {
        console.log("---- Connecting BD")
        await mongoose.connect(db_url,{useUnifiedTopology: true, useNewUrlParser: true})
        console.log("---- BD Connect")
        app.listen(port, () => {
            console.log(`---- SERVER STARTED ON PORT ${port}`)
        })
    } catch (e) {
        console.log(e)
    }
}

startApp();