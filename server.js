const express = require('express');
const { connectDB } = require('./db.js'); 
const app = express();

const accommodationRoutes = require('./routes/accommodation');
const indexRoutes = require('./routes/index');
const port = process.env.PORT || 3000;

//ROUTES
app.use('/', indexRoutes);

//accommodation routes
app.use('/accommodation', accommodationRoutes);

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