// Import required modules
const fs = require('fs')
const path = require('path')
const { Pool, Client} = require('pg')
const copyFrom = require('pg-copy-streams').from
const config = require('../config.json')

// inputfile & target table
var inputFile = path.join(__dirname, './reviews.csv')
var table = 'reviewTable'

// Getting connectin parameters from config.json
const host = config.host
const user = config.user
const pw = config.pw
const db = config.db
const port = config.port
const conString = `postgres://${user}:${pw}@${host}:${port}/${db}`
const tableCreateModelddd = 'CREATE TABLE IF NOT EXISTS testtable(lastname varchar(15) NOT null, firstname varchar(15) NOT null, age integer NOT null, gender varchar(3) NOT null)';
const tableCreate = 'CREATE TABLE IF NOT EXISTS reviewTable(reviewid integer NOT null, productid integer NOT null, username varchar(30) NOT null, title text NOT null, stars integer NOT null, dates TIMESTAMP WITH TIME ZONE NOT null, reviewText text NOT null, recommended text NOT null, photos text[] NOT null, yes integer NOT null, no integer NOT null)'
// Connecting to Database
const client = new Client({
    connectionString: conString,
  })
  const seedClient = new Client({
    connectionString: conString,
  })

client.connect()
    client.query(tableCreate, err => {  
        if (err) {
        console.log("table not created");
        }
        console.log("CREATED");
    });
       
const executeQuery = (targetTable) => {
    const execute = (target, callback) => {
        client.query(`Truncate ${target}`, (err) => {
                if (err) {
                client.end()
                callback(err)
                // return console.log(err.stack)
                } else {
                console.log(`Truncated ${target}`)
                callback(null, target)
                
                
                }
            })
    }
    execute(targetTable, (err) =>{
        if (err) return console.log(`Error in Truncate Table: ${err}`)
        var stream = client.query(copyFrom(`COPY ${targetTable} FROM STDIN DELIMITER '|' CSV HEADER`))
        var fileStream = fs.createReadStream(inputFile)
        
        fileStream.on('error', (error) =>{
            console.log(`Error in creating read stream ${error}`)
        })
        stream.on('error', (error) => {
            console.log(`Error in creating stream ${error}`)
        })
        stream.on('end', () => {
            console.log(`Completed loading data into ${targetTable}`)
            client.end()
            .then(() => {
                seedClient.connect()
                seedClient.query(`ALTER TABLE ${targetTable} ADD PRIMARY KEY (reviewID); ALTER TABLE ${targetTable} ADD CONSTRAINT fk_productID FOREIGN KEY (productID) REFERENCES testtable(productID); CREATE INDEX product_idx on ${targetTable} (productID);`, err => {  
                    if (err) {
                    console.log(err);
                    }
                    else {
                    console.log("INDEXED");
                    seedClient.end();
                }
            });
            
            })
            .catch((err) => {
                console.log(err)
            }) 
        })
        fileStream.pipe(stream);
    })  
}
// Execute the function
executeQuery(table)
