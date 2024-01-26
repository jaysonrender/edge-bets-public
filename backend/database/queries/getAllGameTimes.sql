SELECT nfl_week, home, away, game_time 
    FROM game_schedule 
    WHERE season = ? 
    ORDER BY game_time;
