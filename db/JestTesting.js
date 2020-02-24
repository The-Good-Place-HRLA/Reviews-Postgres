var mongoClient = require('mongodb').MongoClient;
const { Pool, Client} = require('pg');
const config = require('../config.json');
const host = config.host
const user = config.user
const pw = config.pw
const db = config.db
const port = config.port
const conString = `postgres://${user}:${pw}@${host}:${port}/${db}`
const poolPG = new Pool({
    connectionString: conString,
  })


let test = async () => {
    client = await mongoClient.connect("mongodb://localhost:27017");
queryResults = []
    for (var i = 1; i < 20; i++) {
        let query = await client.db("reviewsdc").collection('reviews').find({ "_id": { $gt: 29900000, $lt: 29950000 + i}}).explain("executionStats");
        queryResults.push("Execution Time for id "+ i + " is " + query.executionStats.executionTimeMillis);
        //  queryResults.push(query);
    }
    console.log(queryResults);
}

// test();


let test2 = async () => {
    client = await mongoClient.connect("mongodb://localhost:27017");
queryResults = []
    for (var i = 1; i < 10; i++) {
        var productidNumber = Math.floor(Math.random() * (1000001)) + 9000000;
        let query = await client.db("reviewsdc").collection('reviews').find({ "productID": productidNumber}).explain("executionStats");
        queryResults.push("Execution Time for productid "+ productidNumber + " is " + query.executionStats.executionTimeMillis);
        //  queryResults.push(query);
    }
    console.log(queryResults);
}
test2()

let pgTest1 = async () => {
    const clientPG= await poolPG.connect();
    pgQueryResults = [];
    for (var i = 1; i < 10; i++) {
        var productidNumber = Math.floor(Math.random() * (1000001)) + 9000000;
        const pgQuery = `EXPLAIN ANALYZE SELECT * FROM reviewtable where productid = ${productidNumber};`;
        let queryPGResult = await clientPG.query(pgQuery)
        pgQueryResults.push(queryPGResult.rows[3]);
        //  queryResults.push(query);
    }
    console.log(pgQueryResults);
}
pgTest1();