// const fastcsv = require('fast-csv');
// const fs = require('fs');

// const ws = fs.createWriteStream("out.csv", { flags: 'a' });


// var data = [];


// for (var i = 0; i < 2000000; i++) {
// data.push({
//     name: 'John',
//     surname: 'Snow',
//     age: 26,
//     gender: 'M'
//   });
// };
// fastcsv
//   .write(data, { headers: true })
//   .on('finish', () => {
//     var data = [];
//     for (var i = 0; i < 4000000; i++) {
//         data.push({
//             name: 'John',
//             surname: 'Snow',
//             age: 26,
//             gender: 'M'
//           });
//         };
    
//         fastcsv
//         .write(data)
//         .pipe(ws);
//     })
 const csv = require('fast-csv');
const fs = require('fs');

var append = (file, data) =>  {
    const csvFile = fs.createWriteStream(file, {flags: 'a'});
    csvFile.write(`\n`);
    csv.writeToStream(csvFile, data, {headers: false});
}
var data = [];

var testData = function() {
    var data = [];
    for (var i = 0; i < 4000000; i++) {
        data.push({
            name: 'John',
            surname: 'Snow',
            age: 26,
            gender: 'M',
          });
        };
     return data;   
}

const ws = fs.createWriteStream("out.csv");
data = testData();

 
csv.writeToStream(ws, data, {headers: true})
.on('finish', () => {

    data = testData();
        
append('out.csv', data);
});
  

  