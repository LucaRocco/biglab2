import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import MainPage from './pages/main_page/MainPage';
import FilmTable from './components/film_table/FilmTable';
import { useState } from 'react';
import FilmForm from './components/forms/FilmForm';
import EmptyState from './images/NotFound.png';
import { Button } from 'react-bootstrap';
import API from './API';

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
  const [films, setFilms] = useState([]);
  const [query, setQuery] = useState('');
  const [dirty, setDirty] = useState(false);

  function deleteFilm(filmId) {
    API.deleteFilm(filmId).then(() => {
      setFilms(films.filter(film => film.id !== filmId));
      setDirty(true);
    })
  };

  function addFilm(film) {
    API.addFilm(film).then(() => {
      setFilms(oldFilms => [ ...oldFilms, { ...film, id: null } ]);
      setDirty(true);
  })
  };

  function updateFilm(film) {
    API.updateFilm(film).then(() => {
      setFilms(oldFilms => oldFilms.map(newFilm => newFilm.id === film.id ? Object.assign({}, film) : newFilm));
      setDirty(true);
    }).catch();
  };

  return (
    <Router>
      <Routes>
        <Route path='/' element={<MainPage searchFilm={query => { setQuery(query) }}></MainPage>}>
          <Route index element={<FilmTable films={films} onDelete={deleteFilm} updateFilmFn={updateFilm} query={query} setFilms={setFilms} dirty={dirty} setDirty={setDirty}></FilmTable>} />
        </Route>
        <Route path='/add' element={<FilmForm onSave={addFilm} films={films} />} />
        <Route path='/edit/:filmId' element={<FilmForm onSave={updateFilm} films={films} />} />
        <Route path='*' element={ <NotFoundPage /> } />
      </Routes>
    </Router>)
}

export default App;
