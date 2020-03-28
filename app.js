const express = require('express');
const apiRoutes  =  require('./modules/index');
const {ENVIRONMENT} = require('./configuration/index');
const { resp } = require('./helpers/ResponseHelper');
// const passport = require('passport');
require('./connection/db');
const app = express();

// Handling invalid JSON request
app.use(express.json(), (err, req, res, next) => {
    if (err) {
      return res.status(400).json(resp('BRE', err.message));
    }
    return next(err);
});
  
// Handling invalid urlencoded request
app.use(express.urlencoded({ extended: true }), (err, req, res, next) => {
if (err) {
    return res.status(400).json(resp('BRE', err.message));
}
    return next(err);
});

//routers call
app.use('/api', apiRoutes);

//Handle Invalid url and access
app.use((req,res,next) => {
    const err = new Error(resp('ISE'));
    err.status  = 404;
    next(err);
});

// Gracefully handling internal server errors
app.use((err, req, res, next) => {
    if (res.headersSent) {
      return next();
    }
    // console.timeLog(resp('ISE'));
    
    const response = resp('ISE', `${err.name}: ${err.message}`);
    if (ENVIRONMENT === 'development') {
      response.stack = err.stack;
    }
    res.status(500).json(response);
    return next();
});


let port = process.env.PORT;
if (port === null || port === undefined || port === '') {
  port = 1234;
}

app.listen(port, () => console.log(`Server started on port ${port}`));