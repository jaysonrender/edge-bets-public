SELECT game_id, home, t1.team_name as home_name, away, t2.team_name as away_name, game_time  FROM game_schedule
    LEFT JOIN teams t1 
        ON home = t1.alias
    LEFT JOIN teams t2
        ON away = t2.alias
    WHERE nfl_week = ? AND season = ?
    ORDER BY game_time;