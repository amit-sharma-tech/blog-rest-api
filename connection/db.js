let mongoose = require('mongoose');
require('dotenv/config');
var mongodbErrorHandler = require('mongoose-mongodb-errors')


// const server = '127.0.0.1:27017'; // REPLACE WITH YOUR DB SERVER
// const database = 'fcc-Mail';      // REPLACE WITH YOUR DB NAME

class Database {
  constructor() {
    mongoose.Promise = global.Promise;
    mongoose.plugin(mongodbErrorHandler);
    this._connect()
  }
  
  _connect() {
    mongoose.connect(process.env.DB_CONNECTION , { 
      dbName: process.env.DB_NAME,
      user  : process.env.DB_USERNAME,
      pass  : process.env.DB_PASSWORD,
      useNewUrlParser: true,
      useUnifiedTopology:true,
      useCreateIndex:true 
    }).then(() => {
        console.log('Database connection successful')
    })
    .catch(err => {
      console.error('Database connection error' + err.message)
    })
    mongoose.connection.on('connected',()=>{
      console.log("Mongodb connected to db...");
    });
    mongoose.connection.on('error', (err) =>{
      console.log(err.message);
    });
    mongoose.connection.on('disconnected',()=>{
      console.log('Mongodb connection is disconnected..');
    });
    process.on('SIGINT',()=>{
      mongoose.connection.close(()=>{
        console.log('Mongoose connection is disconnected due to app termination');
      });
      process.exit(0);
    });
  }
}

module.exports = new Database()
