-- create table for different validation processes
CREATE TABLE IF NOT EXISTS item_validation_process (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  description VARCHAR(500),
  name VARCHAR(100) NOT NULL,
  enabled BOOLEAN NOT NULL
);

-- insert initial processes
INSERT INTO item_validation_process (name, description, enabled)
VALUES ('bad-words-detection', 'check all text fields for bad words', TRUE),
  ('aggressive-langauge-classification', 'automatically classify the description if it is considered aggressive or hate speech', FALSE),
  ('image-classification', 'automatically classify image if it contains nudify or not', FALSE);

-- create tables for validation and review statuses
CREATE TABLE IF NOT EXISTS item_validation_status (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS item_validation_review_status (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

INSERT INTO item_validation_status (name)
VALUES ('pending'),
  ('success'),
  ('failure');

INSERT INTO item_validation_review_status (name)
VALUES ('pending'),
  ('accepted'),
  ('rejected');


-- create table for automatic validation records
-- one record for each validation attempt
CREATE TABLE IF NOT EXISTS item_validation (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  item_id UUID NOT NULL REFERENCES item("id") ON DELETE CASCADE,
  created_at timestamp NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc')
);

-- one record for each process
CREATE TABLE IF NOT EXISTS item_validation_group (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  item_id UUID NOT NULL REFERENCES item("id") ON DELETE CASCADE,
  item_validation_id UUID NOT NULL REFERENCES item_validation("id") ON DELETE CASCADE,
  item_validation_process_id UUID NOT NULL REFERENCES item_validation_process("id") ON DELETE CASCADE,
  status_id UUID NOT NULL REFERENCES item_validation_status("id") ON DELETE CASCADE,
  result VARCHAR(50),
  updated_at timestamp NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc'),
  created_at timestamp NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc')
);

-- create table for manual validation records
-- one record for each validation process that needs manual review
CREATE TABLE IF NOT EXISTS item_validation_review (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  item_validation_id UUID NOT NULL REFERENCES item_validation("id") ON DELETE CASCADE,
  reviewer_id UUID REFERENCES member("id") ON DELETE CASCADE,
  status_id UUID NOT NULL REFERENCES item_validation_review_status("id") ON DELETE CASCADE,
  reason VARCHAR(100),
  updated_at timestamp NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc'),
  created_at timestamp NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc')
);
