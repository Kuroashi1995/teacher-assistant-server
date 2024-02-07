export const SELECT_ALL_USERS = `SELECT * FROM app_user`;
export const SELECT_USER_BY_ID = `SELECT * FROM app_user WHERE user_id=$1 LIMIT 1`;
export const INSERT_USER = `
INSERT INTO app_user (first_name, last_name, level, enroll_date, birth_date, turn, is_admin, is_teacher, phone_number)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING *`;
