import dayjs from 'dayjs';

const APIURL = new URL('http://localhost:3001/api');

function getFilms(currentFilter) {
    return new Promise((resolve, reject) => {
        fetch(`${APIURL}/films?filter=${currentFilter}`, {
            credentials: 'include'
        })
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
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: film.title, favorite: film.favorite, rating: film.rating, watchedDate: film.watchedDate ? dayjs(film.watchedDate).format('YYYY-MM-DD') : undefined }),
        }).then(res => {
            if (res.ok) {
                resolve(null);
            } else {
                res.json()
                    .then(message => reject(message))
                    .catch(() => reject({ error: "Parse error" }))
            }
        }).catch(() => { reject({ error: "Cannot communicate with the server." }) });
    });
}


function deleteFilm(filmId) {
    return new Promise((resolve, reject) => {
        fetch(`${APIURL}/films/${filmId}`, {
            method: 'DELETE',
            credentials: 'include'
        }).then(response => {
            if (response.ok) {
                resolve(null);
            } else {
                response.json().then(err => reject(err)).catch(() => reject({ message: "unable to parse" }));
            }
        })
    });
}

function updateFilm(film) {
    return new Promise((resolve, reject) => {
        fetch(`${APIURL}/films/${film.id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: film.id, title: film.title, rating: film.rating, favorite: film.favorite, watchedDate: film.watchedDate ? dayjs(film.watchedDate).format('YYYY-MM-DD') : undefined })
        }).then(response => {
            if (response.ok) {
                resolve(null);
            } else {
                response.json().then(err => reject(err)).catch(() => reject({ message: "unable to parse" }))
            }
        })
    });
}

function logIn(credentials) {
    return fetch(`${APIURL}/sessions`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
    }).then(async res => {
        if (res.ok)
            return res.json();
        throw await res.json();
    });
}

async function getUserInfo() {
    const response = await fetch(`${APIURL}/sessions/current`, { credentials: 'include' });
    const userInfo = await response.json();
    if (response.ok) {
        return userInfo;
    } else {
        throw userInfo;  // an object with the error coming from the server
    }
}

function logout() {
    return fetch(`${APIURL}/sessions/current`, {
        method: 'DELETE',
        credentials: 'include'
    });
}

const API = { getFilms, addFilm, deleteFilm, updateFilm, logIn, getUserInfo, logout };
export default API;