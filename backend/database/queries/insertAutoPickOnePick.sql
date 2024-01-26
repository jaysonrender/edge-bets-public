UPDATE pick_list
    SET pick2 = ?
    WHERE user_id = ? AND season = ? AND pick_week = ?;