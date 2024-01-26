UPDATE leagues
    SET league_admin = (SELECT user_id FROM users where username = ?)
    WHERE league_id = ?;
