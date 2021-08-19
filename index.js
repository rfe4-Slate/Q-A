const port = 8000;
const path = require('path');
const express = require('express');
const app = express();
const axios = require('axios');
const pool = require('./Database/db.js');
const {getQuestions, getAnswers, addQuestions, addAnswer} = require('./Controllers/questions.js');

app.use(express.json());

const routeName = {
  listQuestions: '/qa/questions',
  listAnswers: '/qa/questions/:question_id/answers',
  addQuestion: '/qa/questions'
}

//get

app.get('/', (req, res) => {
  //console.log('req: ', req.query);
  res.status(200).send("Yay! Get Works!");
});


// //  /qa/questions
app.get('/qa/questions', (req, res) => {
  let params = req.query;

  if(params.product_id) {

  getQuestions(params, (err, results) => {
    if(err) {
      console.log("error getting questions");
      res.status(400).send(err);
    } else {
      console.log("Yay! GET /qa/questions works!");
      res.status(200).json(results);
    }
  });
} else {
  res.status(400).send('provide product_id');
}

});
//  /qa/questions/:question_id/answers
app.get('/qa/questions/:question_id/answers', (req, res) => {
  let params = req.params;
  let query = req.query;

  if(params.question_id) {
    //console.log('req: ', req);
    getAnswers(params, query, (err, results) => {
      if(err) {
        console.log("error getting answers" + err);
        res.status(400).send(err);
      } else {
        console.log("Yay! GET /qa/questions/questionID/answers works!");
        res.status(200).json(results);
      }
    });
  } else {
    res.status(400).send('provide question_id');
  }

});

//post
// /qa/questions
app.post('/qa/questions', (req, res) => {
  let bodyParams = req.body;
  // let ts = new Date(Date.now());
  // console.log('time: ', ts);

  //res.status(201).send('yay post works');
  if(!bodyParams.product_id){
    res.status(400).send('provide product_id');
  } else if (!bodyParams.body) {
    res.status(400).send('provide body');
  }  else if (!bodyParams.email) {
    res.status(400).send('provide email');
  }  else if (!bodyParams.name) {
    res.status(400).send('provide name');
  } else {
    addQuestions(bodyParams, (err, results) => {
      if(err) {
        console.log("error posting questions" + err);
        res.status(400).send(err);

      } else {
        console.log("Yay! POST /qa/questions/works!");
        res.status(201).send("Question Created");
      }
    });
  }
});

//  /qa/questions/:question_id/answers
app.post('/qa/questions/:question_id/answers', (req, res) => {
  let bodyParams = req.body;
  let params = req.params;
  // let ts = new Date(Date.now());
  // console.log('time: ', ts);

  //res.status(201).send('yay post works');
  if(!params.question_id){
    res.status(400).send('provide question_id');
  } else if (!bodyParams.body) {
    res.status(400).send('provide body');
  }  else if (!bodyParams.email) {
    res.status(400).send('provide email');
  }  else if (!bodyParams.name) {
    res.status(400).send('provide name');
  } else if (!bodyParams.photos) {
    res.status(400).send('provide photos');
  } else {
    addAnswer(bodyParams, params, (err, results) => {
      if(err) {
        console.log("error posting questions" + err);
        res.status(400).send(err);

      } else {
        console.log("Yay! POST /qa/questions/questionID/answers works!");
        res.status(201).send("Answer Created");
      }
    });
  }
});

//put

//app.put()
//  /qa/questions/:question_id/helpful
//  /qa/questions/:question_id/report
//  /qa/answers/:answer_id/helpful
//  /qa/answers/:answer_id/report



app.listen(port, () => {
  console.log(`listening on port ${port}`);
});