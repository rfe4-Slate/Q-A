const pool = require('../Database/db.js');

const getQuestions = (params, callback) => {
  //
  let productID = params.product_id;
  let page = params.page || 1;
  let count = params.count || 5;

  console.log('params in getquestions: ', params);
  if(params) {
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
      OFFSET 1`;

    pool.query(queryString, (err, results) => {
      if(err) {
        console.log('error with quert');
        callback(err);
      } else {
        console.log(results);
        callback(null, results.rows);
      }
    })
   // callback(null, "yeet");
  } else {
    callback("err");
  }
};


module.exports = {
  getQuestions: getQuestions
}


/*
`SELECT questions.id, body, date_written, asker_name, asker_email, reported, helpful,
    ARRAY_AGG (json_build_object('id', answers.id, 'body' , body, 'date_written', date_written, 'answerer_name', answerer_name,'answerer_email', answerer_email, 'reported', reported, 'helpful', helpful)) as answers FROM review
    LEFT JOIN answers ON question_id = questions.id WHERE product_id = ${productID} GROUP BY review.id LIMIT ${count}`;



    `SELECT * FROM questions
   json_agg(json_build_object('id', answers.id, 'body', body)) FROM answers
     LEFT JOIN answers ON question_id = questions.id
     WHERE product_id = ${productID}
     LIMIT ${count}
     GROUP BY questions.id`;



         let queryString = ` SELECT
    q.product_id as product_id,
    JSON_BUILD_OBJECT(
      'id', q.id,
      'body', q.body,
      'date', q.date_written,
      'asker_name',  q.asker_name,
      'helpfuless', q.helpful,
      'reported', q.reported,
      'answers', JSON_BUILD_OBJECT (
        a.id, JSON_BUILD_OBJECT (
          'id', a.id,
          'body', a.body,
          'date', a.date_written,
          'answerer_name', a.answerer_name,
          'helpfulness', a.helpful,
          'photos', JSON_AGG(p.url)
        )
      )
    ) as results
  FROM
    questions q
  LEFT JOIN
    answers a
  ON
    q.id = a.question_id
  LEFT JOIN
    answers_photos p
  ON
    a.id = p.answer_id
  WHERE
    q.product_id = 1
  GROUP BY
    q.product_id, q.id, a.id
  LIMIT
    2
    OFFSET`;


        let queryString = ` SELECT
    json_build_object( json_agg (JSON_BUILD_OBJECT(
      'id', q.id,
      'body', q.body,
      'date', q.date_written,
      'asker_name',  q.asker_name,
      'helpfuless', q.helpful,
      'reported', q.reported,
      'answers', JSON_BUILD_OBJECT (
        a.id, JSON_BUILD_OBJECT (
          'id', a.id,
          'body', a.body,
          'date', a.date_written,
          'answerer_name', a.answerer_name,
          'helpfulness', a.helpful,
          'photos', JSON_AGG(p.url)
        )
      )
    ))) as results
  FROM
    questions q
  LEFT JOIN
    answers a
  ON
    q.id = a.question_id
  LEFT JOIN
    answers_photos p
  ON
    a.id = p.answer_id
  WHERE
    q.product_id = 1
  GROUP BY
    1
  LIMIT
    2`;

    `SELECT questions.id AS questions_id, questions.body, questions.date_written, questions.asker_name, questions.reported, questions.helpful,
    COALESCE(JSON_OBJECT_AGG(answers.id,
      JSON_BUILD_OBJECT('id', answers.id, 'body', answers.body, 'date', answers.date_written, 'answerer_name', answers.answerer_name, 'helpfulness', answers.helpful, 'photos', ARRAY (
        SELECT answers_photos.url
        FROM answers_photos
        WHERE answers_photos.answer_id = answers.id
        ))) FILTER (WHERE answers.id IS NOT NULL), '{}'::JSON) AS answers
      FROM questions
      LEFT JOIN answers
      ON questions.id = answers.question_id
      WHERE questions.product_id = 1 AND questions.reported > 0
      GROUP BY questions.id
      LIMIT 2
      OFFSET 1`
*/