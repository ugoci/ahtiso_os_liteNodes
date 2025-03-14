// Required modules___________________________________
const bodyParser = require('body-parser');
const request = require('request');
const cors = require('cors');
const express = require('express');
const app = express();
require('dotenv').config();


// Setting the default port for cloud and local operations_______________
const DEFAULT_PORT = process.env.PORT || 2000;  
const ROOT_NODE_ADDRESS = process.env.ROOT_NODE_ADDRESS;

app.use(bodyParser.json());
app.use(cors());

// Function to handle rate limiting
const rateLimit = require('express-rate-limit');
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100 
}));


// GET request to check App health
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});


// function to synchronize the blockchains 
const syncChains = () => {
    request({ url: `${ROOT_NODE_ADDRESS}api/blocks` }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const rootChain = JSON.parse(body);
            console.log('Replace chain on sync with', rootChain);
        }
    })
};


// Function to synchronize the transaction pool
const synchTransactionPool = () =>{
    request({ url: `${ROOT_NODE_ADDRESS}api/transactions` }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            const readbleTransaction = JSON.parse(body);
            console.log('Update transaction pool on sync with', readbleTransaction);
        }
    })
};


// Listening on the right port
app.listen(DEFAULT_PORT, () => {
    console.log(`Listening on Localhost: ${DEFAULT_PORT}`);
    syncChains();   // Synchronize the blockchains while listening on port
    synchTransactionPool(); // Synchronize the transaction pools while listening on port
});



