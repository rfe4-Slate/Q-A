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

module.exports = {
  getQuestions: getQuestions,
  getAnswers: getAnswers
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



      SELECT answers.id AS answer_id, answers.body, answers.date_written, answers.answerer_name, answers.helpful
    ARRAY_AGG(json_build_object('id', answers_photos.id, 'url' , answers_photos.url)) as photos FROM answers
    LEFT JOIN answers_photos ON answer_id = answers.id WHERE question_id = 2 AND reported > 0
    GROUP BY answers.id
    LIMIT 5


    SELECT answers.id as answer_id, answers.body, answers.date_written, answers.answerer_name,answers.helpful,
    COALESCE(
      ARRAY_AGG(
        JSON_BUILD_OBJECT(
          'id', answers_photos.id,
          'url', answers_photos.url
        )) FILTER (WHERE answers_photos.id IS NOT NULL), '[]' AS photos
  FROM answers
  LEFT JOIN answers_photos
  ON answers.id = answers_photos.answer_id
  WHERE answers.question_id = 2 AND answers.reported = 0
  GROUP BY answers.id
  LIMIT 5
  OFFSET 0

  SELECT answers.id as answer_id, answers.body, answers.date_written, answers.answerer_name,answers.helpful,
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
  OFFSET 1
*/