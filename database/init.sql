-- Create the token table
CREATE TABLE token (
    id SERIAL PRIMARY KEY,
    value TEXT
);

-- Insert some sample data into the token table
INSERT INTO token (value) VALUES
    ('token_value_1'),
    ('token_value_2'),
    ('token_value_3');

-- Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(100),
    token_id INT REFERENCES token(id)
);

-- Insert some sample data into the users table
INSERT INTO users (username, email, token_id) VALUES
    ('user1', 'user1@example.com', 1),
    ('user2', 'user2@example.com', 2),
    ('user3', 'user3@example.com', 3);


//users table


    [
  {
    "id": 1,
    "username": "user1",
    "email": "user1@example.com",
    "token_id": 1
  },
  {
    "id": 2,
    "username": "user2",
    "email": "user2@example.com",
    "token_id": 2
  },
  {
    "id": 3,
    "username": "user3",
    "email": "user3@example.com",
    "token_id": 3
  },
  {
    "id": 4,
    "username": "user4",
    "email": "user4@example.com",
    "token_id": 1
  }
]


//token table

[
  {
    "id": 1,
    "value": "token_value_1"
  },
  {
    "id": 2,
    "value": "token_value_2"
  },
  {
    "id": 3,
    "value": "token_value_3"
  }
]

