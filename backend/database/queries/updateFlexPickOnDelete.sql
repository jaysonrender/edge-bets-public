UPDATE users
    SET flex_picks = flex_picks + 1
    WHERE user_id = ?;