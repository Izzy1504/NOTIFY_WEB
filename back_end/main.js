require('dotenv').config()
const express = require('express')
const cors = require('cors')

const { userRouter } = require('./routes/user.js');

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.use('/',userRouter)

const port = process.env.PORT;

app.listen(port)