SELECT a.*, b.username
FROM schedules a
JOIN users b
ON a.user_id = b.user_id;

SELECT user_id, username
FROM users;