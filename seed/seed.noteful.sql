BEGIN;

TRUNCATE
  users,
  notes, 
  folders
  RESTART IDENTITY CASCADE;

INSERT INTO users (user_name, user_password, user_status, visibility)
VALUES 
  ('admin', '$2y$04$zSU5VoU8VRDKOkQhKb2b4O9O0.MZ7IJRePwLq3R.9J9F/q7cyRg3y', 'admin', 'Public'),
  ('user', '$2y$04$dp8tcCEwYkLQBhYxxTPud.ERyc1QrWf09b1CwdNFj8ZTg5P8jzSyC', 'user', 'Public'),
  ('blockuser', '$2y$04$dp8tcCEwYkLQBhYxxTPud.ERyc1QrWf09b1CwdNFj8ZTg5P8jzSyC', 'blocked', 'Private');

INSERT INTO folders (user_id, folder_name)
VALUES 
  (1, 'Important'),
  (2, 'To do'),
  (3, 'My Folder');

INSERT INTO notes (user_id, folder_id, note_name, modified, content)
VALUES 
  (1, 1, 'test note', '12/09/1990', 'This is a test note.'),
  (1, 1, 'test note', '12/09/1990', 'This is a test note.'),
  (2, 2, 'test note', '12/09/1990', 'This is a test note.'),
  (2, 2, 'test note', '12/09/1990', 'This is a test note.'),
  (3, 3, 'test note', '12/09/1990', 'This is a test note.'),
  (3, 3, 'test note', '12/09/1990', 'This is a test note.');

  COMMIT;