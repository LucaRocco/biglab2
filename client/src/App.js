import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import MainPage from './pages/main_page/MainPage';
import FilmTable from './components/film_table/FilmTable';
import { useState } from 'react';
import dayjs from 'dayjs';
import FilmForm from './components/forms/FilmForm';
import EmptyState from './images/NotFound.png';
import { Button } from 'react-bootstrap';

let localFilms = [
  { id: 1, title: "Pulp Fiction", favorite: true, watchedDate: dayjs("2022-01-1"), rating: 5 },
  { id: 2, title: "21 Grams", favorite: false, watchedDate: undefined, rating: 4 },
  { id: 3, title: "Star Wars", favorite: false, watchedDate: undefined, rating: undefined },
  { id: 4, title: "Matrix", favorite: true, watchedDate: dayjs("2022-04-17"), rating: 0 },
  { id: 5, title: "Shrek", favorite: false, watchedDate: dayjs("2022-03-22"), rating: 0 }
];

function NotFoundPage() {
  const navigate = useNavigate();
  return <div className='center-content' >
    <img src={EmptyState} alt='Page Not Found' />
    <div>
    <Button variant='primary' onClick={() => { navigate('/'); }}>Torna alla home</Button>
    </div>
  </div>
}

function App() {
  const [films, setFilms] = useState(localFilms);
  const [query, setQuery] = useState('');

  function deleteFilm(filmId) {
    setFilms(oldFilms => oldFilms.filter(film => film.id !== filmId));
  };

  function addFilm(film) {
    setFilms(oldFilms => [ ...oldFilms, { ...film, id: Math.max.apply(Math, oldFilms.map(f => f.id)) + 1 } ]);
  };

  function updateFilm(film) {
    setFilms(oldFilms => oldFilms.map(f => f.id === film.id ? Object.assign({}, film) : f));
  };

  return (
    <Router>
      <Routes>
        <Route path='/' element={<MainPage searchFilm={query => { setQuery(query) }}></MainPage>}>
          <Route index element={<FilmTable films={films} onDelete={deleteFilm} updateFilmFn={updateFilm} query={query}></FilmTable>} />
        </Route>
        <Route path='/add' element={<FilmForm onSave={addFilm} films={films} />} />
        <Route path='/edit/:filmId' element={<FilmForm onSave={updateFilm} films={films} />} />
        <Route path='*' element={ <NotFoundPage /> } />
      </Routes>
    </Router>)
}

export default App;
