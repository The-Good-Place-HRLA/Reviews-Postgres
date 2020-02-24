var photos = []

for (var i = 1; i <= 25; i++) {
  photos.push(`https://res.cloudinary.com/dy39u3poe/image/upload/v1581377751/FEC/photo${i}.jpg`)
}
console.log(photos);
module.exports = photos;
