SELECT user_id from users
	WHERE user_id NOT IN (SELECT user_id from pick_list where season = ? and pick_week = ?);