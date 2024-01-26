SELECT * from teams 
	WHERE alias NOT IN (
		SELECT pick1 from pick_list
			WHERE user_id = ? AND season = ? AND pick1 IS NOT NULL
		UNION
		SELECT pick2 from pick_list
			WHERE user_id = ? AND season = ? AND pick2 IS NOT NULL)
	ORDER BY alias;