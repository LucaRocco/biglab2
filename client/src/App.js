import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import MainPage from './pages/main_page/MainPage';
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
      setDirty(true);
    })
  };

  function addFilm(film) {
    return new Promise((resolve, reject) => {
      setWait(true);
      API.addFilm(film).then(() => {
        setDirty(true);
        setWait(false);
        resolve(null);
      }).catch(err => reject(err))
    });
  };

  function doLogin(credentials) {
    return API.logIn(credentials)
      .then(user => {
        setUser(user);
        setLoggedIn(true);
      })
  }

  function doLogout() {
    API.logout()
      .then(_ => {
        setUser({});
        setLoggedIn(false);
      });
  }

  function updateFilm(film) {
    return new Promise((resolve, reject) => {
      if (!film.message) {
        setWait(true);
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
          ? <MainPage user={user} searchFilm={query => { setQuery(query) }} films={films} deleteFilm={deleteFilm} updateFilm={updateFilm} query={query} setFilms={setFilms} dirty={dirty} setDirty={setDirty} isLoggedIn={loggedIn} logout={doLogout}></MainPage>
          : <Navigate to='/login' />} />

        <Route path='/add' element={loggedIn ? <FilmForm onSave={addFilm} films={films} wait={wait} /> : <Navigate to='/login' />} />
        <Route path='/edit/:filmId' element={loggedIn ? <FilmForm onSave={updateFilm} films={films} wait={wait} /> : <Navigate to='/login' />} />
        <Route path='/login' element={loggedIn
          ? <Navigate to='/' />
          : <Login login={doLogin} />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </Router>)
}

export default App;
