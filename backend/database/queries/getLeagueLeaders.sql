SELECT user_id, player_rank, fname, lname, score FROM users
	WHERE league_id = ? AND player_rank <= 3
UNION
SELECT user_id, 0 AS player_rank, fname, lname, score FROM users
	WHERE ABS(score) = (SELECT MIN(ABS(score)) FROM users WHERE league_id = ? ) AND league_id = ? AND NOT isnull(player_rank)
UNION
SELECT user_id, player_rank, fname, lname, score from users WHERE player_rank = (SELECT player_rank from users where league_id = ? ORDER BY score ASC LIMIT 1,1) AND league_id = ?
UNION
SELECT user_id, player_rank, fname, lname, score from users
	WHERE score = (SELECT MIN(score) FROM users) AND league_id = ? AND NOT isnull(player_rank)
ORDER BY score DESC;