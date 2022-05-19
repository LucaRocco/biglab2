const sqlite = require('sqlite3');
const dayjs = require('dayjs');
const db = new sqlite.Database('films.db',
    (err) => { if (err) throw err; });

function sqlFilter(filter) {
    switch (filter) {
        case 'best_rated':
            return 'where rating = 5';
        case 'favorites':
            return 'where favorite = 1';
        case 'seen_last_month':
            return `where watchedDate >= '${dayjs().subtract(1, 'month').format('YYYY-MM-DD')}'`;
        case 'unseen':
            return 'where watchedDate is null';
        default:
            return '';
    }
}

exports.getOneById = (filmId) => new Promise((resolve, reject) => {
    db.get('select * from films where id = ?', [filmId], (err, film) => {
        if (err) reject(err);
        else {
            if (!film) {
                reject({ status: 404, message: `film with id ${filmId} not found` });
            } else {
                resolve({ status: 200, responseBody: film});
            }
        }
    })
});

exports.getAllOrFiltered = (filter) => new Promise((resolve, reject) => {
    db.all(`select * from films ${sqlFilter(filter)}`, (err, rows) => {
        if (err) reject({ message: err.message });
        else resolve(rows);
    })
});

exports.addFilm = (film) => new Promise((resolve, reject) => {
    db.run('insert into films(title, favorite, watchedDate, rating, user) values(?, ?, ?, ?, ?)',
        [film.title, film.favorite, film.watchedDate, film.rating, film.user], (err) => {
            if (err) reject(err);
            else resolve();
        });
});

exports.updateFilm = (filmId, film) => new Promise((resolve, reject) => {
    db.run(`UPDATE films SET title=?, favorite=?, watchedDate=?, rating=?, user=? where id=?`,
        [film.title, film.favorite, film.watchedDate, film.rating, film.user, filmId], (err) => {
            if (err) reject(err);
            else resolve();
        });
});

exports.deleteFilm = (filmId) => new Promise((resolve, reject) => {
    db.run('DELETE FROM films WHERE id = ?', [filmId], err => {
        if (err) reject({ message: err });
        else resolve();
    });
});
