import './FilmTable.css';
import Table from 'react-bootstrap/Table'
import PlusIcon from '../../images/plus.svg';
import { RiLogoutCircleRLine } from 'react-icons/ri'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { filterNamesArray, underscoreToUpperCase } from '../../helper/NameHelper';
import dayjs from 'dayjs';
import { Rating } from 'react-simple-star-rating';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import { useEffect } from 'react';
import API from '../../API';

function FilmTable({ user, films, onDelete, updateFilmFn, setFilms, dirty, setDirty, isLoggedIn, logout }) {
  const navigate = useNavigate();
  const [searchParam] = useSearchParams();
  const filterFromSearchParams = searchParam.get('filter');
  const currentFilter = filterNamesArray.includes(filterFromSearchParams) ? filterFromSearchParams : 'all';



  useEffect(() => {
    if (isLoggedIn) {
      if (dirty || currentFilter) {
        API.getFilms(currentFilter)
            .then(films => {
              setFilms(films);
              setDirty(false);
            })
            .catch(err => console.log(err));
      }
    }
  }, [currentFilter, dirty, setDirty, setFilms, isLoggedIn]);

  function handleRatingChange(film, rating) {
    const oldRating = film.rating;
    if (oldRating === film.rating) {
        film.rating = (oldRating === rating ? rating - 1 : rating)
        return film
    }
    return ({message: 'same'})
  }

  return <>
    <h1 className='mt-3 p-0'>Welcome {user.name}</h1>
    <h2 className='mt-3 p-0'>Filter: {underscoreToUpperCase(currentFilter)}</h2>
    <Table>
      <thead>
        <tr>
          <td>Title</td><td>Favorite</td><td>Watch Date</td><td>Rating</td><td>Actions</td>
        </tr>
      </thead>
      <tbody>
        {
          films.map((film) => {
            return (
              <tr key={film.id}>
                <td className={film.favorite ? 'redTitle' : ''}>{film.title}</td>
                <td><input type='checkbox' onChange={(event) => { updateFilmFn({ ...film, favorite: event.target.checked }) }} checked={film.favorite}></input></td>
                <td>{film.watchedDate ? dayjs(film.watchedDate).format("YYYY-MM-DD") : <b>Not Watched</b>}</td>
                <td>
                  {
                    <Rating size='22' onClick={(value) => updateFilmFn(handleRatingChange(film, value / 20))} ratingValue={film.rating * 20}></Rating>
                  }
                </td>
                <td>
                  <BsTrash style={{ marginRight: '10px' }} onClick={() => onDelete(film.id)} cursor='pointer' color='red' />
                  <BsPencilSquare onClick={() => { navigate(`/edit/${film.id}`) }} cursor='pointer' />
                </td>
              </tr>);
          })
        }
      </tbody>
    </Table>
    <button className='floating-button' onClick={() => { navigate('/add') }}><img src={PlusIcon} className='floating-icon svg-white' alt='Add Film' /></button>
    <button className='floating-button-left' onClick={() => { logout(); }}><RiLogoutCircleRLine size="25px"/></button>
  </>
}

export default FilmTable;