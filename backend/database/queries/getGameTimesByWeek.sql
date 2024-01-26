SELECT game_id, home, away, game_time FROM game_schedule
    WHERE nfl_week = ? and season = ?
    ORDER BY game_time;