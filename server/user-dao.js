const sqlite = require('sqlite3');
const crypto = require('crypto');

const db = new sqlite.Database('films.db',
    (err) => { if (err) throw err; });

exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE id = ?';
        db.get(sql, [id], (err, row) => {
            if (err)
                reject(err);
            else if (row === undefined)
                resolve({ error: 'User not found.' });
            else {
                // by default, the local strategy looks for "username": not to create confusion in server.js, we can create an object with that property
                const user = { id: row.id, username: row.email, name: row.name }
                resolve(user);
            }
        });
    });
};

exports.getUser = (email, pass) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
            if (err) { reject(err); }
            else if (row === undefined) { resolve(false); }
            else {
                const user = { id: row.id, username: row.email, name: row.name };
                const salt = row.salt;
                crypto.scrypt(pass, salt, 32, (err, hashedPassword) => {
                    if (err) reject(err);
                    const passHex = Buffer.from(row.hash, 'hex');
                    if (!crypto.timingSafeEqual(passHex, hashedPassword)) {
                        resolve(false);
                    } else resolve(user);
                });
            }
        });
    });
}