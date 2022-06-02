import dayjs from 'dayjs';

const baseUrl = 'http://localhost:3001/api/films';

async function fetchFilms(currentFilter) {
    const response = await fetch(`${baseUrl}?filter=${currentFilter}`);
    if (response.ok) {
        return response.json()
            .then(films => {
                return films.map(film => ({ ...film, watchedDate: (film.watchedDate ? dayjs(film.watchedDate) : undefined) }));
            })
            .catch(err => console.log(err));
    } else {
        throw Error("Connection error");
    }
}

function delFilm(filmId) {
    return fetch(`${baseUrl}/${filmId}`, {
        method: 'DELETE'
    });
}

async function postFilm(film) {
    try {
        return await fetch(`${baseUrl}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...film, user: 1 })
        });
    } catch (err) {
        throw Error("Server connection error");
    }
}

async function putFilm(film) {
    try {
        return await fetch(`${baseUrl}/${film.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...film, watchedDate: film.watchedDate ? film.watchedDate.format('YYYY-MM-DD') : undefined, user: 1 })
        });
    } catch (_) {
        return Error("Server comunication error");
    }
}

export { fetchFilms, delFilm, postFilm, putFilm }