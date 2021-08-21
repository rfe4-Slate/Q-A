DROP DATABASE IF EXISTS sdc;

CREATE DATABASE sdc;

CREATE TABLE IF NOT EXISTS questions (
  id SERIAL PRIMARY KEY NOT NULL,
  product_id INTEGER NOT NULL,
  body TEXT NOT NULL,
  date_written BIGINT NOT NULL,
  asker_name TEXT NOT NULL,
  asker_email TEXT NOT NULL,
  reported INTEGER NOT NULL,
  helpful INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS answers (
  id SERIAL PRIMARY KEY NOT NULL,
  question_id INTEGER NOT NULL,
  body TEXT NOT NULL,
  date_written BIGINT NOT NULL,
  answerer_name TEXT NOT NULL,
  answerer_email TEXT NOT NULL,
  reported INTEGER NOT NULL,
  helpful INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS answers_photos (
  id SERIAL PRIMARY KEY NOT NULL,
  answer_id INTEGER NOT NULL,
  url TEXT NOT NULL,

);


COPY questions
FROM '/Users/harshitadandu/Desktop/HR/SEI/SDC/questions.csv'
WITH (format csv, header);

COPY answers
FROM '/Users/harshitadandu/Desktop/HR/SEI/SDC/answers.csv'
WITH (format csv, header);

COPY answers_photos
FROM '/Users/harshitadandu/Desktop/HR/SEI/SDC/answers_photos.csv'
WITH (format csv, header);

ALTER TABLE questions ALTER COLUMN date_written SET DATA TYPE timestamp without time zone USING to_timestamp(date_written/1000), ALTER COLUMN date_written SET DEFAULT current_timestamp;
ALTER TABLE answers ALTER COLUMN date_written SET DATA TYPE timestamp without time zone USING to_timestamp(date_written/1000), ALTER COLUMN date_written SET DEFAULT current_timestamp;


CREATE INDEX questions_products_seq ON questions(product_id);
CREATE INDEX answers_question_seq ON answers(question_id);
CREATE INDEX photos_answers_seq ON answers_photos(answer_id);