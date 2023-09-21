const client = require('../client')

const createMessage = async ({ sender_id, receiver_id, message_content, thread_id }) => {
    try {
        let newThreadId = thread_id; 

        if (!newThreadId) {
            // create new thread_id when not provided
            const {
                rows: [message],
            } = await client.query('INSERT INTO messages DEFAULT VALUES RETURNING thread_id;');
            newThreadId = message.thread_id;
        } else {
            newThreadId = thread_id; // use the exsisting thread_id
        }

        const {
            rows: [message],
        } = await client.query (
            `
            INSERT INTO messages(sender_id, receiver_id, message_content, sender_username, receiver_username, thread_id)
            VALUES($1, $2, $3, (SELECT username FROM users WHERE user_id = $1), (SELECT username FROM users WHERE user_id = $2), $4)
            RETURNING *;
            `,
            [sender_id, receiver_id, message_content, newThreadId]
        )
        
        return message
    } catch (error) {
        throw error
    }
}




//GET - /api/messages - get all messages
const getAllMessages = async () => {
    try {
        const { rows } = await client.query(`
        SELECT
        m.message_id,
        m.message_content,
        s.user_id AS sender_id,
        s.first_name AS sender_first_name,
        s.photos AS sender_photos,
        r.user_id AS receiver_id,
        r.first_name AS receiver_first_name,
        r.photos AS receiver_photos,
        m.thread_id
        FROM
        messages m
        INNER JOIN
        users s ON m.sender_id = s.user_id
        INNER JOIN
        users r ON m.receiver_id = r.user_id
        ORDER BY
        m.thread_id, m.created_at;
        `);
        return rows;
    } catch (error) {
        throw error;
    }
}

// Get all messages in a thread by thread_id
const getMessagesByThread = async (thread_id) => {
    try {
        const { rows } = await client.query(`
        SELECT
        m.message_id,
        m.message_content,
        s.user_id AS sender_id,
        s.first_name AS sender_first_name,
        s.photos AS sender_photos,
        r.user_id AS receiver_id,
        r.first_name AS receiver_first_name,
        r.photos AS receiver_photos,
        m.thread_id
      FROM
        messages m
      INNER JOIN
        users s ON m.sender_id = s.user_id
      INNER JOIN
        users r ON m.receiver_id = r.user_id
      WHERE
        m.thread_id = $1
      ORDER BY
        m.created_at;
        `, [thread_id]);

        return rows;
    } catch (error) {
        throw error;
    }
}


//GET - /api/messages/:message_id - get message by id
const getMessageById = async (message_id) => {
    try {
        const { rows: [message] } = await client.query(`
            SELECT
            m.message_id,
            m.message_content,
            s.user_id AS sender_id,
            s.first_name AS sender_first_name,
            s.photos AS sender_photos,
            r.user_id AS receiver_id,
            r.first_name AS receiver_first_name,
            r.photos AS receiver_photos,
            m.thread_id
            FROM
            messages m
            INNER JOIN
            users s ON m.sender_id = s.user_id
            INNER JOIN
            users r ON m.receiver_id = r.user_id
            WHERE m.message_id = $1;
        `, [message_id]);

        return message;
    } catch (error) {
        throw error;
    }
}


//DELETE - /api/messages/:message_id - delete message
const deleteMessage = async (message_id) => {
    try {
        const { rows: [message], } = await client.query(`
        DELETE 
        FROM messages
        WHERE message_id = ${message_id};
        `);
        return message;
    } catch (error) {
        throw error;
    }
}

//PUT - /api/messages/edit/:message_id - edit message
const editMessage = async (message_id, updatedMessage) => {
    try {
        const { rows: [message] } = await client.query(`
            UPDATE messages
            SET
            sender_id = $1,
            receiver_id = $2,
            message_content = $3,
            thread_id = $4
            WHERE message_id = $5
            RETURNING *;
        `, [
            updatedMessage.sender_id,
            updatedMessage.receiver_id,
            updatedMessage.message_content,
            updatedMessage.thread_id,
            message_id
        ]);

        return message;
    } catch (error) {
        throw error;
    }
}


module.exports = { createMessage, getAllMessages, getMessageById, deleteMessage, editMessage, getMessagesByThread }