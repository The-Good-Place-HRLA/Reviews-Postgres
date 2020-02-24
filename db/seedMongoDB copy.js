const { promisify } = require('util');
const exec = promisify(require('child_process').exec)
var mongoClient = require('mongodb').MongoClient;
let command = 'mongoimport --db=magic --collection=reviews --type=csv --columnsHaveTypes --headerline --file= reviewsMongo.csv --ignoreBlanks'
async function seed() {
    let res = await exec(command)
    return { res }
}
// let exec = require('child_process').exec

// exec(command, (err, stdout, stderr) => {
//   // check for errors or if it was succesfuly
//   cb()
// })


seed().then(() => {

mongoClient.connect("mongodb://localhost:27017/", function (err, db) {
       
         if(err) throw err;
         var ops = [];
         dbs = db.db("magic")

         dbs.collection('reviews').find({ "photos": { "$type": 2} }).forEach(doc => {
           var children = doc.photos.split(',').map( e => e.replace(/"|\[|\]|\\/gm,'').toString());
           console.log(children);
           ops.push({
             "updateOne": {
               "filter": { "_id": doc._id },
               "update": { "$set": { "photos": children } }
             }
           });
    
           if ( ops.length >= 1000 ) {
             dbs.collection('reviews').bulkWrite(ops);
             ops = [];
           }             
         });
         
         if ( ops.length > 0 ) {
           dbs.collection('reviews').bulkWrite(ops);
           ops = [];
         }
         
});
    





});


