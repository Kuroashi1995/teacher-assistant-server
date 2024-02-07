export const SELECT_CREDENTIALS_BY_USERNAME_OR_MAIL = `SELECT * FROM credentials WHERE (username = $1 OR user_email = $1) LIMIT 1`;
export const INSERT_CREDENTIALS = `
INSERT INTO credentials (username, user_email, user_password, user_id)
VALUES ($1, $2, $3, $4)
RETURNING *
`;
export const UPDATE_CREDENTIALS = `
UPDATE credentials
SET
username = $1,
user_email = $2,
user_password = $3
WHERE user_id = $4
RETURNING *
`;
