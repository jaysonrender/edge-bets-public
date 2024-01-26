SELECT user_id from users
	WHERE user_id IN (SELECT user_id from pick_list where season = ? and pick_week = ? AND auto_pick = 1);