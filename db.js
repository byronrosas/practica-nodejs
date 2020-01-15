require('dotenv').config({ path: './sample.env' });
const { MongoClient } = require('mongodb');

let db;
let client;
async function connectDB() {
    const url = process.env.DB_URL || 'mongodb://localhost/accommodationDB';    
    client = new MongoClient(url, { userNewUrlParser: true });
    await client.connect();
    console.log('Connected to MongoDB at', url);    
    db = client.db();
    return db;        
}


function getDB() {
    return db;
}

function closeDB() {
    client.close();
}

module.exports = { connectDB, getDB, closeDB};
