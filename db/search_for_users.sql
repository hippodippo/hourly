SELECT * FROM users
WHERE user_name LIKE $1 OR user_name = $1;
