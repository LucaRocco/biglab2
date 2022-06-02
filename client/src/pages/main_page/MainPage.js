import MyNavbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/sidebar/Sidebar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FilmTable from '../../components/film_table/FilmTable';

export default function MainPage(props) {
  const { searchFilm, films, deleteFilm, updateFilm, query, setFilms, dirty, setDirty, isLoggedIn } = props;

  return (
    <div>
      <MyNavbar searchFilm={searchFilm} ></MyNavbar>
      <Container fluid={true} className='vh-100'>
        <Row style={ { paddingTop: '3.7rem', height: '100%' } }>
          <Col className='grey-background' md={2}>
            <Sidebar></Sidebar>
          </Col>
          <Col md={1}>
          </Col>
          <Col md={8}>
            <Row> <FilmTable films={films} onDelete={deleteFilm} updateFilmFn={updateFilm} query={query} setFilms={setFilms} dirty={dirty} setDirty={setDirty} isLoggedIn={isLoggedIn}></FilmTable> </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}