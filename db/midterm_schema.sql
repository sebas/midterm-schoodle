DROP DATABASE midterm;
CREATE DATABASE midterm OWNER labber;

\c midterm;

DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS event_options CASCADE;
DROP TABLE IF EXISTS participants CASCADE;

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title varchar(100),
  place varchar(50),
  note varchar (50),
  organizer_name varchar(50),
  organizer_email varchar(50),
  super_secret_URL varchar(50)
);

CREATE TABLE event_options (
  id SERIAL PRIMARY KEY,
  event_id integer references events(id),
  option_text varchar(100)
);

CREATE TABLE participants (
  id SERIAL PRIMARY KEY,
  event_id integer references events(id),
  event_option_id integer references event_options(id),
  username varchar(40),
  email varchar(40)
);
