SELECT fname, lname, username, email, league_name, users.league_id, paid_status FROM users
	LEFT JOIN leagues
    ON leagues.league_id = users.league_id
    WHERE user_id = ? and users.league_id = ?;