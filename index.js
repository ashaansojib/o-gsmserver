const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 9988

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.send('the ogsmserver is running')
});
app.listen(port, async (req, res) => {
    console.log('the server is running on 9988 port')
});