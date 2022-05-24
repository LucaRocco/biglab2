import dayjs from 'dayjs';

const APIURL = new URL('http://localhost:3001/api');

function getFilms(currentFilter) {
    return new Promise((resolve, reject) => {
        fetch(`${APIURL}/films?filter=${currentFilter}`)
            .then(res => {
                if (res.ok) {
                    res.json()
                        .then(films => resolve(films.map(film => ({ ...film, watchedDate: (film.watchedDate ? dayjs(film.watchedDate) : undefined) }))))
                        .catch(() => reject({ error: "Parse error" }));
                }
            }).catch(() => {
                reject({ error: "Network error" })
            })
    });
}

function addFilm(film) {
    return new Promise((resolve, reject) => {
        fetch(`${APIURL}/films`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({title: film.title, favorite: film.favorite, rating: film.rating, watchedDate: film.watchedDate ? dayjs(film.watchedDate).format('YYYY-MM-DD') : undefined, user: 1}),
        }).then(res => {
            if (res.ok) {
                resolve(null);
            } else {
                res.json()
                .then(message => reject(message))
                .catch(() => reject({error: "Parse error"}))
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) });
    });
}


function deleteFilm(filmId) {
    return new Promise((resolve, reject) => {
        fetch(`${APIURL}/films/${filmId}`, {
            method: 'DELETE'
        }).then(response => {
            if(response.ok) {
                resolve(null);
            } else {
                response.json().then(err => reject(err)).catch(() => reject({message: "unable to parse"}));
            }
        })
    });
}

function updateFilm(film) {
    return new Promise((resolve, reject) => {
        fetch(`${APIURL}/films/${film.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({id: film.id, title: film.title, rating: film.rating, favorite: film.favorite, watchedDate: film.watchedDate ? dayjs(film.watchedDate).format('YYYY-MM-DD') : undefined, user: film.user  })
        }).then( response => {
            if (response.ok) {
                resolve(null);
            } else {
                response.json().then(err => reject(err)).catch(() => reject({message: "unable to parse"}))
            }
        })
    });
}

const API = { getFilms, addFilm, deleteFilm, updateFilm };
export default API;