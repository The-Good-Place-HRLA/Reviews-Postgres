const faker = require('faker');
const fs = require('fs');
const writeUsers = fs.createWriteStream('testty.csv');
const _ = require('lodash');
const allPhotos = require('./photos');
writeUsers.write('id | productID | username | title | stars | date | reviewText | recommended | photos | yes | no\n', 'utf8');
function writeTenMillionUsers(writer, encoding, callback) {
    let i = 40000;
    let id = 0;
    let productID = 0;
    function write() {
      let ok = true;
      do {
        i -= 1;
        id += 1;
        if (productID === 10000000) {
        productID = 1;
        console.log("10 MILLION ADDED");
        console.log(new Date().now);
        }
        else {
            productID +=1;
        }
        var numPhotos = faker.random.number({ min: 0, max: 3 });
        var rawPhotos = [];

        for (var k = 0; k < numPhotos; k++) {
          rawPhotos.push(allPhotos[faker.random.number({ min: 0, max: 24 })])
        }

        var photos = _.uniq(rawPhotos);
        var photo ='"{';
        photos.forEach(element => photo+= '"'+ element + ",")
        photo = photo.slice(0, photo.length-1) 
        photo += '"}"';
        var title = faker.company.catchPhrase();
        var stars = faker.random.number({ min: 1, max: 5 });
        var date = JSON.stringify(faker.date.past(1));
        date = date.slice(1,date.length-1)
        var reviewText = faker.hacker.phrase() + ' ' + faker.lorem.sentences(faker.random.number({ min: 1, max: 2 }));
        var recommended = faker.random.boolean();
        var yes = faker.random.number({ min: 0, max: 20 });
        var no = faker.random.number({ min: 0, max: 20 });

        const username = faker.internet.userName();
        const data = `${id}|${productID}|${username}|${title}|${stars}|${date}|${reviewText}|${recommended}|"{${photos}}" |${yes}|${no}\n`;
        if (i === 0) {
          writer.write(data, encoding, callback);
        } else {
  // see if we should continue, or wait
  // don't pass the callback, because we're not done yet.
          ok = writer.write(data, encoding);
        }
      } while (i > 0 && ok);
      if (i > 0) {
  // had to stop early!
  // write some more once it drains
        writer.once('drain', write);
      }
    }
  write()
  }

  writeTenMillionUsers(writeUsers, 'utf-8', () => {
    writeUsers.end();
  });