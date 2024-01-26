UPDATE users SET paid_status = true WHERE user_id IN (?);
UPDATE users SET paid_status = false WHERE user_id IN (?);
