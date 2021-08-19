const pool = require('../Database/db.js');

const getQuestions = (params, callback) => {
  //
  let productID = params.product_id;
  let page = Number(params.page) || 1;
  let count = Number(params.count) || 5;
  let num = (count * page - count);

  //console.log('params in getquestions: ', params);
  if (params) {
    let queryString = `SELECT questions.id AS questions_id, questions.body, questions.date_written, questions.asker_name, questions.reported, questions.helpful,
    COALESCE(JSON_OBJECT_AGG(answers.id,
      JSON_BUILD_OBJECT('id', answers.id, 'body', answers.body, 'date', answers.date_written, 'answerer_name', answers.answerer_name, 'helpfulness', answers.helpful, 'photos', ARRAY (
        SELECT answers_photos.url
        FROM answers_photos
        WHERE answers_photos.answer_id = answers.id
        ))) FILTER (WHERE answers.id IS NOT NULL), '{}'::JSON) AS answers
      FROM questions
      LEFT JOIN answers
      ON questions.id = answers.question_id
      WHERE questions.product_id = ${productID} AND questions.reported = 0
      GROUP BY questions.id
      LIMIT ${count}
      OFFSET ${num}`;

    return new Promise((resolve, reject) => {
      pool.query(queryString, (err, results) => {
        if (err) {
          console.log('error with get questions query');
          reject(err);
        } else {
          //console.log(results);
          resolve(results);
        }
      });
    }).then((result) => {
      let sendResults = {
        'product_id': productID,
        'results': result.rows
      };
      callback(null, sendResults);
    }).catch((err) => {
      callback(err);
    })
    // callback(null, "yeet");
    //callback(null, results.rows);

  } else {
    callback("err");

  }
};

//-------------------------------------------------------------------------------------------------------------------------------------//

const getAnswers = (params, query, callback) => {
  let questionID = params.question_id;
  let page = Number(query.page) || 1;
  let count = Number(query.count) || 5;
  let num = (count * page - count);
  //callback(null, [questionID, page, count, num]);

  if (params) {
    let queryString = `SELECT answers.id as answer_id, answers.body, answers.date_written, answers.answerer_name,answers.helpful,
    COALESCE(
      ARRAY_AGG(
        JSON_BUILD_OBJECT(
          'id', answers_photos.id,
          'url', answers_photos.url
        )) FILTER (WHERE answers_photos.id IS NOT NULL), '{}') AS photos
  FROM answers
  LEFT JOIN answers_photos
  ON answers.id = answers_photos.answer_id
  WHERE answers.question_id = 1 AND answers.reported = 0
  GROUP BY answers.id
  LIMIT 5
  OFFSET 1`;

    return new Promise((resolve, reject) => {
      pool.query(queryString, (err, results) => {
        if (err) {
          console.log('error with get answers query');
          reject(err);
        } else {
          //console.log(results);
          resolve(results);
        }
      });
    }).then((result) => {
      let sendResults = {
        'question': questionID,
        'page': page,
        'count': count,
        'results': result.rows
      };
      callback(null, sendResults);
    }).catch((err) => {
      callback(err);
    });

  } else {
    callback("err" + err);

  }
  //console.log(questionID, "---", page, "---", count, "---", num);
};

const addQuestions = (bodyParams, callback) => {
  //
  let productID = bodyParams.product_id;
  let body = bodyParams.body;
  let name = bodyParams.name;
  let email = bodyParams.email;
  // let date = ts;
  // console.log(date);
  let values = [productID, body, name, email]

  //console.log('params in getquestions: ', params);
  if (bodyParams) {
    let queryString = `
    INSERT INTO questions (id, product_id, body, asker_name, asker_email, reported, helpful)
    VALUES ((setval('questions_id_seq', (SELECT MAX(id) FROM questions)+1)), $1, $2, $3, $4, 0, 0)`;

    return new Promise((resolve, reject) => {
      pool.query(queryString, values, (err, results) => {
        if (err) {
          console.log('error with post questions query');
          reject(err);
        } else {
          //console.log(results);
          resolve(results);
        }
      });
    }).then((result) => {
      callback(null, result);
    }).catch((err) => {
      callback(err);
    })
    // callback(null, "yeet");
    //callback(null, results.rows);

  } else {
    callback("err");

  }
};

const addAnswer = (bodyParams, params, callback) => {
  //
  let questionID = params.question_id;
  let body = bodyParams.body;
  let name = bodyParams.name;
  let email = bodyParams.email;
  let photos = bodyParams.photos;
  // let date = ts;
  // console.log(date);
  let values = [questionID, body, name, email, photos]

  //console.log('params in getquestions: ', params);
  if (params && bodyParams) {
    let queryString = `
    WITH newAnswer AS (
      INSERT INTO answers
      (id, question_id, body, answerer_name, answerer_email, reported, helpful)
      VALUES
      ((setval('answers_id_seq', (SELECT MAX(id) FROM answers)+1)), $1, $2, $3, $4, 0, 0) RETURNING id)
        INSERT INTO answers_photos (answer_id, url)
        SELECT id, UNNEST(($5)::text[]) FROM newAnswer`;

    return new Promise((resolve, reject) => {
      pool.query(queryString, values, (err, results) => {
        if (err) {
          console.log('error with post answers query');
          reject(err);
        } else {
          //console.log(results);
          resolve(results);
        }
      });
    }).then((result) => {
      callback(null, result);
    }).catch((err) => {
      callback(err);
    })
    // callback(null, "yeet");
    //callback(null, results.rows);

  } else {
    callback("err");
  }
};


const markQuestionHelpful = (params, callback) => {
  let questionID = params.question_id;

  let values = [questionID];

  if (params) {
    let queryString = `
    UPDATE questions
    SET helpful = helpful + 1
    WHERE id = $1`;

    return new Promise((resolve, reject) => {
      pool.query(queryString, values, (err, results) => {
        if (err) {
          console.log('error with put question helpful query');
          reject(err);
        } else {
          //console.log(results);
          resolve(results);
        }
      });
    }).then((result) => {
      callback(null, result);
    }).catch((err) => {
      callback(err);
    })

  } else {
    callback("err");
  }

};

const reportQuestion = (params, callback) => {
  let questionID = params.question_id;
  let values = [questionID];

  if (params) {
    let queryString = `
    UPDATE questions
    SET reported = reported + 1
    WHERE id = $1`;

    return new Promise((resolve, reject) => {
      pool.query(queryString, values, (err, results) => {
        if (err) {
          console.log('error with put question reported query');
          reject(err);
        } else {
          //console.log(results);
          resolve(results);
        }
      });
    }).then((result) => {
      callback(null, result);
    }).catch((err) => {
      callback(err);
    })

  } else {
    callback("err");
  }

};

const markAnswerHelpful = (params, callback) => {
  let answerID = params.answer_id;
  let values = [answerID];

  if (params) {
    let queryString = `UPDATE answers
    SET helpful = helpful + 1
    WHERE id = $1`;

    return new Promise((resolve, reject) => {
      pool.query(queryString, values, (err, results) => {
        if (err) {
          console.log('error with put answer helpful query');
          reject(err);
        } else {
          //console.log(results);
          resolve(results);
        }
      });
    }).then((result) => {
      callback(null, result);
    }).catch((err) => {
      callback(err);
    })

  } else {
    callback("err");
  }

};

const reportAnswer = (params, callback) => {
  let answerID = params.answer_id;
  let values = [answerID];

  if (params) {
    let queryString = `UPDATE answers
    SET reported = reported + 1
    WHERE id = $1`;

    return new Promise((resolve, reject) => {
      pool.query(queryString, values, (err, results) => {
        if (err) {
          console.log('error with put answer reported query');
          reject(err);
        } else {
          //console.log(results);
          resolve(results);
        }
      });
    }).then((result) => {
      callback(null, result);
    }).catch((err) => {
      callback(err);
    })

  } else {
    callback("err");
  }

};
module.exports = {
  getQuestions: getQuestions,
  getAnswers: getAnswers,
  addQuestions: addQuestions,
  addAnswer: addAnswer,
  markQuestionHelpful: markQuestionHelpful,
  reportQuestion: reportQuestion,
  markAnswerHelpful: markAnswerHelpful,
  reportAnswer: reportAnswer
}


/*
INSERT INTO questions (product_id, body, asker_name, asker_email, reported, helpful)
    VALUES (2, "hi", test, hi@test.com, 0, 0)
*/