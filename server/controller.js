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



const controller = {
  getAll: (req, res) => {
    db.getAll()
      .then((reviews) => res.status(200).send(reviews))
      .catch((err) => res.status(400).send(err))
    },
  getOne: (req, res) => {
    var productID = parseInt(req.params.productID);
   poolPG.query(`SELECT * FROM reviewtable where productid = ${productID};`)
    .then((reviews) => {
      res.status(200).send(reviews.rows);
    
  })
  //     .catch((err) => res.status(400).send(err))
    },
  addReview: (req, res) => { 
      // db.addReview(req.params.productID, req.body.review)
      // .then(() => res.status(201).send('review added '))
      // .catch((err) => res.status(401).send(err))
  },
  addHelpful: (req, res) => {
    // db.addHelpful(req.params, req.body)
    //   .then(() => { res.status(202).send('helpcount updated ')})
    //   .catch((err) => res.status(402).send(err))
   },
  delete: (req, res) => { 
    db.delete(req.params)
      .then(() => { res.status(203).send('review deleted ')})
      .catch((err) => res.status(403).send(err))
  }
}

module.exports = controller;