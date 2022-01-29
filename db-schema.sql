-- create table for different validation processes
CREATE TABLE IF NOT EXISTS item_validation_process (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL 
);

INSERT INTO item_validation_process (name)
VALUES ('bad words detection'),
  ('aggressive language and hate speech detection');

-- create table for automatic validation records
-- one record for each validation process
CREATE TABLE IF NOT EXISTS item_validation (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  item_id UUID NOT NULL,
  process_id UUID NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  result VARCHAR(100),
  update_at timestamp NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc'),
  create_at timestamp NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc'),
  FOREIGN KEY (item_id) REFERENCES item("id") ON DELETE CASCADE
  FOREIGN KEY (process_id) REFERENCES item_validation_process("id") ON DELETE CASCADE
)

-- create table for manual validation records
-- one record for each validation process that needs manual review
CREATE TABLE IF NOT EXISTS item_validation_review (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  validation_id UUID NOT NULL,
  reviewer_id UUID,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  reason VARCHAR(100),
  update_at timestamp NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc'),
  create_at timestamp NOT NULL DEFAULT (NOW() AT TIME ZONE 'utc'),
  FOREIGN KEY (validation_id) REFERENCES item_validation("id") ON DELETE CASCADE,
  FOREIGN KEY (reviewer_id) REFERENCES member("id") ON DELETE CASCADE
);