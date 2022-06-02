import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import MainPage from './pages/main_page/MainPage';
import FilmTable from './components/film_table/FilmTable';
import { useEffect, useState } from 'react';
import FilmForm from './components/forms/FilmForm';
import EmptyState from './images/NotFound.png';
import { Button } from 'react-bootstrap';
import API from './API';
import Login from './pages/login_form/Login';
import { Navigate } from 'react-router-dom';

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
  const [wait, setWait] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch (err) {
        //TODO: handle error
        //console.log(err);
      }
    };

    checkAuth();
  }, []);

  function deleteFilm(filmId) {
    API.deleteFilm(filmId).then(() => {
      setFilms(films.filter(film => film.id !== filmId));
      setDirty(true);
    })
  };

  function addFilm(film) {
    return new Promise((resolve, reject) => {
      setWait(true);
      setFilms(oldFilms => [...oldFilms, { ...film, id: 1 }]);
      API.addFilm(film).then(() => {
        setDirty(true);
        setWait(false);
        resolve(null);
      }).catch(err => reject(err))
    });
  };

  function doLogin(credentials) {
    API.logIn(credentials)
      .then(user => {
        console.log(user);
        setUser(user);
        setLoggedIn(true);
      })

    setLoggedIn(true);

  }

  function updateFilm(film) {
    return new Promise((resolve, reject) => {
      if (!film.message) {
        setWait(true);
        setFilms(oldFilms => oldFilms.map(newFilm => newFilm.id === film.id ? Object.assign({}, film) : newFilm));
        API.updateFilm(film).then(() => {
          setDirty(true);
          setWait(false);
          resolve(null)
        }).catch(err => reject(err));
      }
    });
  };

  return (
    <Router>
      <Routes>
        <Route path='/' element={loggedIn
          ? <MainPage user={user} searchFilm={query => { setQuery(query) }}></MainPage>
          : <Navigate to='/login' />}>
          <Route index element={<FilmTable films={films} onDelete={deleteFilm} updateFilmFn={updateFilm} query={query} setFilms={setFilms} dirty={dirty} setDirty={setDirty}></FilmTable>} />
        </Route>
        <Route path='/add' element={<FilmForm onSave={addFilm} films={films} wait={wait} />} />
        <Route path='/edit/:filmId' element={<FilmForm onSave={updateFilm} films={films} wait={wait} />} />
        <Route path='*' element={<NotFoundPage />} />
        <Route path='/login' element={loggedIn
          ? <Navigate to='/' />
          : <Login login={doLogin} />} />
      </Routes>
    </Router>)
}

export default App;
