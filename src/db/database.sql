SELECT 'CREATE DATABASE testserial'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'testserial')\gexec
\connect testserial

CREATE TABLE client (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    google BOOLEAN DEFAULT FALSE,
    email VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE list (
    id SERIAL PRIMARY KEY,
    description VARCHAR(50) NOT NULL,
    client_id INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (client_id) REFERENCES client(id)
);

CREATE TABLE film (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) UNIQUE NOT NULL,
    year INT NOT NULL,
    poster_path VARCHAR (50),
    backdrop_path VARCHAR (50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE review (
  id SERIAL PRIMARY KEY,
  client_id INT NOT NULL,
  film_id INT NOT NULL,
  rating INT NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (client_id) REFERENCES client(id),
  FOREIGN KEY (film_id) REFERENCES film(id)
);

CREATE TABLE connection (
  id SERIAL PRIMARY KEY,
  follower_id INT NOT NULL,
  followed_id INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (follower_id) REFERENCES client(id),
  FOREIGN KEY (followed_id) REFERENCES client(id)
);

CREATE TABLE watchlist (
  id SERIAL PRIMARY KEY,
  film_id INT NOT NULL,
  client_id INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (film_id) REFERENCES film(id),
  FOREIGN KEY (client_id) REFERENCES client(id)
);

CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  review_id INT NOT NULL,
  client_id INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (review_id) REFERENCES review(id),
  FOREIGN KEY (client_id) REFERENCES client(id)
);

CREATE TABLE list_likes (
  id SERIAL PRIMARY KEY,
  list_id INT NOT NULL,
  client_id INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (list_id) REFERENCES list(id) ON DELETE CASCADE,
  FOREIGN KEY (client_id) REFERENCES client(id)
);

CREATE TABLE film_likes (
  id SERIAL PRIMARY KEY,
  film_id INT NOT NULL,
  client_id INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  FOREIGN KEY (film_id) REFERENCES film(id) ON DELETE CASCADE,
  FOREIGN KEY (client_id) REFERENCES client(id)
);

CREATE TABLE list_movies (
    id SERIAL PRIMARY KEY,
    list_id INT NOT NULL,
    film_id INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (film_id) REFERENCES film(id),
    FOREIGN KEY (list_id) REFERENCES list(id) ON DELETE CASCADE
);

CREATE TABLE password_reset_tokens (
  id SERIAL PRIMARY KEY,
  token VARCHAR(255) NOT NULL,
  client_id INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  FOREIGN KEY (client_id) REFERENCES client(id) ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION update_updated_at_trigger()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_updated_at
AFTER UPDATE ON client
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_trigger();


INSERT INTO client (name,last_name,password,email) VALUES ('Satoshi','Nakamoto','Angular14','angular14m@gmail.com');
INSERT INTO client (name,last_name,password,email) VALUES ('Charles','Hoskinson','cardano','charles@cardano');
INSERT INTO client (name,last_name,password,email) VALUES ('Brad','Garlinghouse','ripple','brad@xrp');

INSERT INTO film (title,year, poster_path, backdrop_path) VALUES ('Pretty Little Liars','2010','/vC324sdfcS313vh9QXwijLIHPJp.jpg', '/rQGBjWNveVeF8f2PGRtS85w9o9r.jpg');
INSERT INTO film (title,year, poster_path, backdrop_path) VALUES ('Mr. Robot','2015','/esN3gWb1P091xExLddD2nh4zmi3.jpg', '/v8Y9yurHuI7MujWQMd8iL3Gy4B5.jpg');
INSERT INTO film (title,year, poster_path, backdrop_path) VALUES ('Suits','2011', '/i6Iu6pTzfL6iRWhXuYkNs8cPdJF.jpg', '/8SAQqivlp74MZ7u55ccR1xa0Nby.jpg');
INSERT INTO film (title,year, poster_path, backdrop_path) VALUES ('Game of Thrones', '2011', '/jIhL6mlT7AblhbHJgEoiBIOUVl1.jpg', '/mUkuc2wyV9dHLG0D0Loaw5pO2s8.jpg');
INSERT INTO film (title,year, poster_path, backdrop_path) VALUES ('The Walking Dead', '2010', '/vxuoMW6YBt6UsxvMfRNwRl9LtWS.jpg', '/zYFQM9G5j9cRsMNMuZAX64nmUMf.jpg');
INSERT INTO film (title,year, poster_path, backdrop_path) VALUES ('The Big Bang Theory', '2007', '/wQoosZYg9FqPrmI4zeCLRdEbqAB.jpg', '/nGsNruW3W27V6r4gkyc3iiEGsKR.jpg');
INSERT INTO film (title,year, poster_path, backdrop_path) VALUES ('Doctor Who', '2005', '/igDhbYQTvact1SbNDbzoeiFBGda.jpg', '/cVWsigSx97cTw1QfYFFsCMcR4bp.jpg');
INSERT INTO film (title,year, poster_path, backdrop_path) VALUES ('Breaking Bad','2008', '/1yeVJox3rjo2jBKrrihIMj7uoS9.jpg', '/eSzpy96DwBujGFj0xMbXBcGcfxX.jpg');




INSERT INTO review (client_id,film_id,rating,comment) VALUES ('1','1','4','Amazing Movie');
INSERT INTO connection (followed_id,follower_id) VALUES ('1','2');

INSERT INTO watchlist (film_id,client_id) VALUES ('1','1');
INSERT INTO likes (review_id,client_id) VALUES ('1','2');

INSERT INTO list (description, client_id) VALUES ('my fav','2');
INSERT INTO list (description, client_id) VALUES ('my list','1');


INSERT INTO list_movies (list_id,film_id) VALUES ('1','1');
INSERT INTO list_movies (list_id,film_id) VALUES ('1','2');
INSERT INTO list_movies (list_id,film_id) VALUES ('1','3');
INSERT INTO list_movies (list_id,film_id) VALUES ('1','4');

INSERT INTO list_movies (list_id,film_id) VALUES ('2','5');
INSERT INTO list_movies (list_id,film_id) VALUES ('2','6');
INSERT INTO list_movies (list_id,film_id) VALUES ('2','7');
INSERT INTO list_movies (list_id,film_id) VALUES ('2','8');


INSERT INTO list_likes (list_id,client_id) VALUES ('1','1');
INSERT INTO list_likes (list_id,client_id) VALUES ('1','3');

INSERT INTO film_likes (film_id,client_id) VALUES ('1','1');
INSERT INTO film_likes (film_id,client_id) VALUES ('2','1');
INSERT INTO film_likes (film_id,client_id) VALUES ('3','1');
INSERT INTO film_likes (film_id,client_id) VALUES ('4','1');






