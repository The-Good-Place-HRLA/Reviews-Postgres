const { promisify } = require('util');
const exec = promisify(require('child_process').exec)
const spawn = promisify(require('child_process').spawn)
var mongoClient = require('mongodb').MongoClient;
let command = 'mongoimport --db=reviewsdc --collection=reviews --type=csv --columnsHaveTypes --headerline --file= reviewsMongo.csv --ignoreBlanks'
async function seed() {
    let res = await exec(command)
    return { res }
}
// let exec = require('child_process').exec

// exec(command, (err, stdout, stderr) => {
//   // check for errors or if it was succesfuly
//   cb()
// })
let fun = async () => {

    client = await mongoClient.connect("mongodb://localhost:27017");
             var ops = [];
    
    
             let query = await client.db("reviewsdc").collection('reviews').find({ "photos": { "$type": 2} }).limit(500000);
             query.forEach(doc => {
               let children = doc.photos.split(',').map(e => e.replace(/"|\[|\]|\\/gm,'').toString());
               ops.push({
                 "updateOne": {
                   "filter": { "_id": doc._id },
                   "update": { "$set": { "photos": children } }
                 }
               });
               
            })
            .then(() => {
                if ( ops.length >= 1000 ) {
                    client.db("reviewsdc").collection('reviews').bulkWrite(ops);
        
                     ops = [];
                   }             
                 
                
                        if ( ops.length > 0 ) {
                        console.log("EXECUTED")
                        client.db("reviewsdc").collection('reviews').bulkWrite(ops);
        
                    
                      
           
                      ops = [];
           
                    }
    
            })
              }

// seed().then(
//     fun()
// );
    
fun();





