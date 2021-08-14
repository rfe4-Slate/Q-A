const port = 8000;
const path = require('path');
const express = require('express');
const app = express();
const axios = require('axios');
const pool = require('./Database/index.js');

app.use(express.json());

//get

app.get('/', (req, res) => {
  res.status(200).send("Yay!");
});
//  /qa/questions
//  /qa/questions/:question_id/answers


//put
//  /qa/questions/:question_id/helpful
//  /qa/questions/:question_id/report
//  /qa/answers/:answer_id/helpful
//  /qa/answers/:answer_id/report


//post
// /qa/questions
//  /qa/questions/:question_id/answers


app.listen(port, () => {
  console.log(`listening on port ${port}`);
});