UPDATE users
    SET flex_picks = flex_picks - ?
    WHERE user_id = ?;