const faker = require('faker/index');
const Reviews = require('./model');
const allPhotos = require('./photos');
const _ = require('lodash');

Reviews.remove({})
  .then(() => { console.log('old db clear, seeding new db...') })
  .then(() => {
    for (var i = 0; i < 100; i++) {
      var reviews = [];
      var numReviews = faker.random.number({ min: 15, max: 50 });

      for (var j = 0; j < numReviews; j++) {
        var numPhotos = faker.random.number({ min: 0, max: 6 });
        var rawPhotos = [];

        for (var k = 0; k < numPhotos; k++) {
          rawPhotos.push(allPhotos[faker.random.number({ min: 0, max: 24 })])
        }

        var photos = _.uniq(rawPhotos);
       
        var review = {
          username: faker.internet.userName(),
          title: faker.company.catchPhrase(),
          stars: faker.random.number({ min: 1, max: 5 }),
          date: faker.date.past(1),
          reviewText: faker.hacker.phrase() + ' ' + faker.lorem.sentences(faker.random.number({ min: 2, max: 6 })),
          recommended: faker.random.boolean(),
          photos,
          helpful: {
            yes: faker.random.number({ min: 0, max: 20 }),
            no: faker.random.number({ min: 0, max: 20 })
          }
        }
        reviews.push(review);
      }

      let product = {
        productID: i,
        reviews: reviews
      }

      Reviews.create(product);
      console.log('product ', i, ' created')
    }

  })
  .then(() => {
    console.log('db seeded')
  })
  .catch(err => console.log(err))