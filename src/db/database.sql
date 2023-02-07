SELECT 'CREATE DATABASE nocountryapp'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'nocountryapp')\gexec
\connect nocountryapp

CREATE TABLE client (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE film (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    year INT NOT NULL,
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


INSERT INTO client (name,last_name,password,email) VALUES ('Satoshi','Nakamoto','bitcoin','satoshi@bitcoin');
INSERT INTO client (name,last_name,password,email) VALUES ('Charles','Hoskinson','cardano','charles@cardano');
INSERT INTO client (name,last_name,password,email) VALUES ('Brad','Garlinghouse','ripple','brad@xrp');

INSERT INTO film (title,year) VALUES ('guardian','2020');
INSERT INTO film (title,year) VALUES ('lift','2021');
INSERT INTO film (title,year) VALUES ('innovation','2022');

INSERT INTO review (client_id,film_id,rating,comment) VALUES ('1','1','4','Amazing Movie');
INSERT INTO connection (followed_id,follower_id) VALUES ('1','2');

INSERT INTO watchlist (film_id,client_id) VALUES ('1','1');
INSERT INTO likes (review_id,client_id) VALUES ('1','2');



