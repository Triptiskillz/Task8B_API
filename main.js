let mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();
let axios = require("axios");
let { Client } = require("pg");
var express = require("express");
var app = express();
let { Version3Client } = require("jira.js");
// const uuidv4 = require("uuid/v4")
var port = process.env.PORT || 2410;
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  next();
});
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

// connect to database
const conn = new Client({
  user: "postgres",
  password: "XucVG4MpDboPEenF",
  database: "postgres",
  port: 5432,
  host: "db.zyfxxxdjujuwsxznlsar.supabase.co",
  ssl: { rejectUnauthorized: false },
});
conn.connect(function (res, error) {
  console.log(`Connected!!!`);
});

let data =[]
app.get("/", async function (req, res) {
  try {
    let response = await axios.get(`https://sheetdb.io/api/v1/br5ukb6vm2e0a`);
  
  //  data = response.data

    res.send(data);
  } catch (err) {
    console.log("bye");
  }
});
