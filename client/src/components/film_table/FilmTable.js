import './FilmTable.css';
import Table from 'react-bootstrap/Table'
import PlusIcon from '../../images/plus.svg';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { filterNames, filterNamesArray, underscoreToUpperCase } from '../../helper/NameHelper';
import dayjs from 'dayjs';
import { Rating } from 'react-simple-star-rating';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';

function filterFilms(films, currentFilter, query) {
  let result = [];
  switch (currentFilter) {
    case filterNames.all:
      result = [...films];
      break;
    case filterNames.bestRated:
      result =  films.filter(film => film.rating === 5);
      break;
    case filterNames.favorites:
      result = films.filter(film => film.favorite);
      break;
    case filterNames.seenLastMonth:
      result = films.filter(film => film.watchedDate ? film.watchedDate.isAfter(dayjs().subtract(1, 'month')) : false);
      break;
    case filterNames.unseen:
      result =  films.filter(film => !film.watchedDate);
      break;
    default:
      break;
  }
  return result.filter(film => film.title.toLowerCase().startsWith(query.toLowerCase()));
}

function FilmTable({ films, onDelete, updateFilmFn, query }) {
  const navigate = useNavigate();
  const [searchParam] = useSearchParams();
  const filterFromSearchParams = searchParam.get('filter');
  const currentFilter = filterNamesArray.includes(filterFromSearchParams) ? filterFromSearchParams : 'all';

  const filteredFilms = filterFilms(films, currentFilter, query);

  function handleRatingChange(film, rating) {
    const oldRating = film.rating;
    film.rating = (oldRating === rating ? rating - 1 : rating)
    return film
  }

  return <>
  <h1 className='mt-3 p-0'>Filter: { underscoreToUpperCase(currentFilter) }</h1>
    <Table>
    <thead>
    <tr>
      <td>Title</td><td>Favorite</td><td>Watch Date</td><td>Rating</td><td>Actions</td>
    </tr>
  </thead>
      <tbody>
        {
          filteredFilms.map((film) => {
            return (
              <tr key={film.id}>
                <td className={film.favorite ? 'redTitle' : ''}>{film.title}</td>
                <td><input type='checkbox' onChange={(event) => { updateFilmFn({ ...film, favorite: event.target.checked }) }} checked={film.favorite}></input></td>
                <td>{film.watchedDate ? film.watchedDate.format("YYYY-MM-DD") : <b>Not Watched</b>}</td>
                <td>
                  {
                    <Rating size='22'onClick={(value) => updateFilmFn(handleRatingChange(film, value / 20))} ratingValue={film.rating * 20}></Rating>
                  }
                </td>
                <td>
                  <BsTrash style={{ marginRight: '10px' }} onClick={() => onDelete(film.id)} cursor='pointer' color='red'/>
                  <BsPencilSquare onClick={() => { navigate(`/edit/${film.id}`) }} cursor='pointer' />
                </td>
              </tr>);
          })
        }
      </tbody>
    </Table>
    <button className='floating-button' onClick={() => { navigate('/add') }}><img src={PlusIcon} className='floating-icon svg-white' alt='Add Film' /></button>
  </>
}

export default FilmTable;