const client = require('../client')


//POST - /api/users
const createUser = async ({ username, password, first_name, last_name, gender, location, education, work, photos, about_me, song }) => {
    try {
        const {
            rows: [user],
            //INSER SQL query
        } = await client.query (
            // INSERT INTO table(column1, column2, etc)
            //VALUES (var1, etc)
            //RETURNING everything
            `
                INSERT INTO users(username, password, first_name, last_name, gender, location, education, work, photos, about_me, song)
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING *;
            `,
            //hook parameteres to variables
            [username, password, first_name, last_name, gender, location, education, work, photos, about_me, song]
        )
        return user
    } catch (error) {
        throw error
    }
}

//GET - /api/users - get all users
const getAllUsers = async () => {
    try {
        const {rows}
        = await client.query(`
            SELECT *
            FROM users;
        `)
        return rows
    } catch (error) {
        throw error
    }
}

//GET - /api/users/:user_id
const getUserById = async (user_id) => {
    try {
        const { rows: [user], }
        = await client.query(`
        SELECT * 
        FROM users
        WHERE user_id = ${user_id};
        `);
         return user;
        } catch (error) {
         throw error;
    }
}


// PUT - /api/users/:user_id - update a user
const updateUser = async (user_id, updatedUserData) => {
    try {
        const { rows: [user], }
        = await client.query(`
        UPDATE users 
        SET 
        username = $1, 
        password = $2, 
        first_name = $3, 
        last_name = $4, 
        gender = $5, 
        location = $6, 
        education = $7, 
        work = $8, 
        photos = $9, 
        about_me = $10, 
        song = $11
        WHERE user_id = ${user_id}
        RETURNING *;
        `,
        [
            updatedUserData.username,
            updatedUserData.password,
            updatedUserData.first_name,
            updatedUserData.last_name,
            updatedUserData.gender,
            updatedUserData.location,
            updatedUserData.education,
            updatedUserData.work,
            updatedUserData.photos,
            updatedUserData.about_me,
            updatedUserData.song             
        ]
        );
         return user;
        } catch (error) {
         throw error;
    }
}

//DELETE - /api/users/:user_id - delete user 
const deleteUser = async (user_id) => {
    try {
        const { rows: [user], }
        = await client.query(`
        DELETE 
        FROM users
        WHERE user_id = ${user_id};
        `);
         return user;
        } catch (error) {
         throw error;
    }
}



module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser }