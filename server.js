const express = require('express');
const { connectDB } = require('./db.js'); 
const app = express();

const port = process.env.API_SERVER_PORT || 3000;

// DATABASE
(async function startConnection() {
    try {
      await connectDB();
      app.listen(port, () => {
        console.log(`API listen by port ${port}`);
      });
    } catch (err) {
      console.log('Error', err);
    }
  }());
// END DATABASE