import './FilmForm.css';
import Button from 'react-bootstrap/Button';
import { Alert, Col, Container, Row, Spinner } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { Rating } from 'react-simple-star-rating';

function FilmForm({ onSave, films, wait }) {

  const { filmId } = useParams();
  const film = films.find(f => f.id.toString() === filmId);

  const [title, setTitle] = useState(film ? film.title : '');
  const [watchedDate, setDate] = useState(film && film.watchedDate ? film.watchedDate.format('YYYY-MM-DD') : '');
  const [rating, setRating] = useState(film ? film.rating * 20 : 0);
  const [favorite, setFavorite] = useState(film ? film.favorite : false);
  const [errorMsg, setErrorMsg] = useState('');

  const [invalidFields, setInvalidFields] = useState({
    title: false,
    date: false
  });
  const navigate = useNavigate();

  function handleAdd(event) {
    const errors = [];
    event.preventDefault();
    if (!title) {
      errors.push('Title cannot be empty');
      setInvalidFields(invFields => ({ ...invFields, title: true }));
    }

    if (!film && films.find(f => f.title.toLowerCase().trim() === title.toLowerCase().trim()) !== undefined) {
      errors.push('This films already exists');
      setInvalidFields(invFields => ({ ...invFields, title: true }));
    }

    if (errors.length) {
      setErrorMsg(
        errors.map((errorMessage, index) => <p key={index} className='no-bottom-margin'> {'- ' + errorMessage} </p>));
      return;
    }

    onSave({ id: film ? film.id : undefined, title, favorite, watchedDate: watchedDate ? dayjs(watchedDate) : undefined, rating: (rating / 20), user: 1 });
    navigate('/');

  }

  function onTitleChange(event) {
    setTitle(event.target.value);
  }

  function onDateChange(event) {
    if (dayjs(event.target.value).isAfter(dayjs())) return;
    setDate(event.target.value);
  }

  function onRatingChange(value) {
    if (rating === value) {
      setRating(value - 20);
      return;
    }
    setRating(value);
  }

  function onFavoriteChange(event) {
    setFavorite(event.target.checked);
  }

  return (
    <>
      <Form onSubmit={handleAdd}>
        <Container className='form-container'>
          <h1>{film ? 'Update Film' : 'Add Film'}</h1>
          {errorMsg ? <Alert variant='danger' onClose={() => { setErrorMsg(''); }} dismissible>{errorMsg}</Alert> : false}
          <Row>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="filmTitle" name="filmTable">Title</Form.Label>
              <Form.Control required={true} isInvalid={invalidFields.title} value={title} onChange={onTitleChange} id="filmTitle" placeholder="Film Title" />
            </Form.Group>
          </Row>
          <Row>
            <Col md={5}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="watchedDate">Watched Date</Form.Label>
                <Form.Control type="date" max={dayjs().format('YYYY-MM-DD')} isInvalid={invalidFields.date} value={watchedDate} onChange={onDateChange} id="watchedDate" placeholder="Not Watched Yet" />
              </Form.Group>
            </Col>
            <Row className='mb-3'>
              <Col className='d-flex justfy-content-center m-auto'>
                <Form.Group md={3}>
                  <Rating onClick={onRatingChange} ratingValue={rating}></Rating>
                </Form.Group>
              </Col>
              <Col className='d-flex justfy-content-center m-auto' md={9}>
                <Form.Group>
                  <Form.Check label='Favorite' defaultChecked={favorite} onChange={onFavoriteChange} type="checkbox" id="favorite" />
                </Form.Group>
              </Col>
            </Row>

          </Row>
          <div className='button-container'>
            <Button onClick={() => { navigate('/'); }} variant='secondary'>Cancel</Button>
            {
              wait
                  ? <Spinner animation="border" variant="primary" className='right'/>
                  : <Button type='submit' onClick={handleAdd} className='right'>{film ? 'Update' : 'Add'}</Button>
            }
          </div>
        </Container>
      </Form>
    </>
  );
}

export default FilmForm;