SELECT user_id, fname, lname, username, email, paid_status FROM users
WHERE league_id = ?
ORDER BY lname;
;
