import './Navbar.css';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { BsCollectionPlay, BsPersonCircle } from 'react-icons/bs';

function MyBrand() {
  return (
    <Navbar.Brand><BsCollectionPlay size='25px' className='logo'/>{' '}FilmLibrary</Navbar.Brand>);
}

function SearchBar({ searchFilm }) {
  return (
    <Form className="d-flex" onSubmit={event => { event.preventDefault(); }}>
      <FormControl type="search" placeholder="Search Film" className="me-2" aria-label="Search" onChange={(event) => { searchFilm(event.target.value.trim()) }} />
    </Form>);
}

function UserIndicator() {
  return <BsPersonCircle color='white' size='30px' />
}

export default function MyNavbar({ searchFilm }) {
  return <Navbar bg="primary" variant="dark" fixed='top'>
    <Container fluid={true}>
      <MyBrand></MyBrand>
      <SearchBar searchFilm={searchFilm}></SearchBar>
      <UserIndicator></UserIndicator>
    </Container>
  </Navbar>
}