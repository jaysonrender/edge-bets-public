use babb_picks;

DROP TRIGGER IF EXISTS update_user_score_rank;
DROP TRIGGER IF EXISTS update_user_score_rank_2;

delimiter //
CREATE TRIGGER update_user_score_rank
        AFTER INSERT ON scores
    FOR EACH ROW BEGIN
                UPDATE users
                Join
                (SELECT p.user_id as id, SUM(ifnull(s1.score, 0) + ifnull(s2.score, 0)) as total FROM pick_list p
                LEFT JOIN scores s1
                        ON p.pick1 = s1.team_alias AND p.pick_week = s1.nfl_week AND p.season = s1.season AND p.auto_pick != 2
                LEFT JOIN scores s2
                        ON p.pick2 = s2.team_alias AND p.pick_week = s2.nfl_week AND p.season = s2.season AND p.auto_pick = 0
                WHERE p.season = '2023PRE'
                GROUP BY p.user_id
        ) points on users.user_id = points.id
                set score = points.total;

        UPDATE users as u, (Select user_id, RANK() OVER (PARTITION BY league_id ORDER BY score DESC) as player_rank from users) as r
                        SET u.player_rank = r.player_rank
                        WHERE u.user_id = r.user_id;

    END;

//
delimiter ;
delimiter //
CREATE TRIGGER update_user_score_rank_2
        AFTER UPDATE ON scores
    FOR EACH ROW BEGIN
                UPDATE users
                Join
                (SELECT p.user_id as id, SUM(ifnull(s1.score, 0) + ifnull(s2.score, 0)) as total FROM pick_list p
                LEFT JOIN scores s1
                        ON p.pick1 = s1.team_alias AND p.pick_week = s1.nfl_week AND p.season = s1.season AND p.auto_pick != 2
                LEFT JOIN scores s2
                        ON p.pick2 = s2.team_alias AND p.pick_week = s2.nfl_week AND p.season = s2.season AND p.auto_pick = 0
                WHERE p.season = '2023PRE'
                GROUP BY p.user_id
        ) points on users.user_id = points.id
                set score = points.total;

        UPDATE users as u, (Select user_id, RANK() OVER (PARTITION BY league_id ORDER BY score DESC) as player_rank from users) as r
                        SET u.player_rank = r.player_rank
                        WHERE u.user_id = r.user_id;

    END;

//
delimiter ;