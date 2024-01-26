CREATE DATABASE IF NOT EXISTS edge_bets;

USE edge_bets;



CREATE TABLE IF NOT EXISTS leagues (
	league_id CHAR(6) PRIMARY KEY, -- use as invite code
    league_name VARCHAR(30),
    league_admin INT
);

CREATE TABLE IF NOT EXISTS users (
	user_id INT PRIMARY KEY AUTO_INCREMENT,
    league_id CHAR(6),
    fname VARCHAR(30),
    lname VARCHAR(30),
    username VARCHAR(30) UNIQUE,
    password_hash VARCHAR(64), -- USE SHA-256 hashing algorithm
    email VARCHAR(40) UNIQUE,
    user_type SET('root','admin','player'),
    score INT DEFAULT 0,
    player_rank INT,
    flex_picks INT DEFAULT 4,
    CHECK (flex_picks <= 4 AND flex_picks >= 0)
);

CREATE TABLE IF NOT EXISTS teams (
	
    alias VARCHAR(3) PRIMARY KEY,
    team_name VARCHAR(40)
	-- image (file path for team logo image)

);

CREATE TABLE IF NOT EXISTS pick_list (
	user_id INT ,
    season VARCHAR(8), 
    pick_week INT,
    pick1 VARCHAR(3),
    pick2 VARCHAR(3),
	auto_pick INT,
	CHECK (auto_pick <=2 AND auto_pick >=0)
    PRIMARY KEY(user_id, season, pick_week);
);

CREATE TABLE IF NOT EXISTS game_schedule (
    season VARCHAR(8), -- format YYYY{PRE | REG | POST}
	nfl_week INT,
    game_id VARCHAR(36),
    home VARCHAR(3),
    away VARCHAR(3),
    game_time DATETIME
);

CREATE TABLE IF NOT EXISTS scores (
    season VARCHAR(8), --see game_schedule
    nfl_week INT,
    team_alias VARCHAR(3),
    score INT,

    PRIMARY KEY(season, nfl_week, team_alias)
);


-- Set up foreign keys
ALTER TABLE leagues
	ADD FOREIGN KEY (league_admin) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE users
	ADD FOREIGN KEY (league_id) REFERENCES leagues(league_id) ON UPDATE CASCADE ON DELETE CASCADE;
ALTER TABLE scores 
    ADD FOREIGN KEY (team_alias) REFERENCES teams(alias);    
ALTER TABLE pick_list
	ADD FOREIGN KEY (user_id) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE CASCADE,
	ADD FOREIGN KEY (pick1) REFERENCES teams(alias) ON UPDATE CASCADE,
    ADD FOREIGN KEY (pick2) REFERENCES teams(alias) ON UPDATE CASCADE;
ALTER TABLE game_schedule
	ADD FOREIGN KEY (home) REFERENCES teams(alias),
    ADD FOREIGN KEY (away) REFERENCES teams(alias);



CREATE VIEW user_score_and_rank AS (
    SELECT league_id, username, fname, lname, score, player_rank FROM users
);

CREATE VIEW user_score_and_picks AS
(SELECT u.username as username, u.fname as fname, u.lname as lname, u.score as score, p.pick1 as "Pick 1", s1.score as "Pick 1 Score", p.pick2 as "Pick 2", s2.score as "Pick 2 Score" from users u
	LEFT JOIN pick_list p
		ON u.user_id = p.user_id
	LEFT JOIN scores s1
		ON p.pick1 = s1.team_alias and p.pick_week = s1.nfl_week
	LEFT JOIN scores s2
		ON p.pick2 = s2.team_alias and p.pick_week = s2.nfl_week)
	;
    
-- Query to update users scores and ranks when scores table is updated 
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
		WHERE p.season = '2023REG'
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
		WHERE p.season = '2023REG'
		GROUP BY p.user_id
        ) points on users.user_id = points.id
		set score = points.total;
        
        UPDATE users as u, (Select user_id, RANK() OVER (PARTITION BY league_id ORDER BY score DESC) as player_rank from users) as r
			SET u.player_rank = r.player_rank
			WHERE u.user_id = r.user_id;
        
    END;
    
// 
delimiter ;

-- Create a root league and user for dev/testing
INSERT INTO leagues VALUES('ABCDEF', 'root_league', NULL);
INSERT INTO users values(1, 'ABCDEF', 'root', 'user', 'root', SHA2('password', 256), 'email@email.com', 'root', 0, 0, 4);
INSERT INTO pick_list VALUES(1, NULL, NULL, NULL);

UPDATE leagues SET league_admin = '1' WHERE league_id = 'ABCDEF';



