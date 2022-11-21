const Pool = require("pg").Pool;
require("dotenv").config();

const devConfig = `postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`

const proConfig = process.env.DATABASE_URL // HEROKU ADDONS 

const pool = new Pool ({
  connectionString: process.env.NODE_ENV === "production" ? proConfig : devConfig,
  ssl: {
    rejectUnauthorized: false,
},
});

pool.connect((error)=>{
  if (error) {
    console.log(error);
    return console.log("Error connect a Database");
  } else {
    return console.log("Connect Database !");
  }
});

module.exports = pool;