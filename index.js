const port = 8000;
const path = require('path');
const express = require('express');
const app = express();
const axios = require('axios');
const pool = require('./Database/db.js');

app.use(express.json());

const routeName = {
  listQuestions: '/qa/questions',
  listAnswers: '/qa/questions/:question_id/answers',
  addQuestion: '/qa/questions'
}

//get

app.get('/', (req, res) => {
  console.log('req: ', req);
  res.status(200).send("Yay! Get Works!");
});


// //  /qa/questions
app.get('/qa/questions', (req, res) => {
  res.status(200).send("Yay! GET /qa/questions works!");
});
//  /qa/questions/:question_id/answers


//put

//app.put()
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