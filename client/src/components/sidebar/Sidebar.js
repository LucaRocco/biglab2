import Nav from 'react-bootstrap/Nav';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { filterNamesArray, underscoreToUpperCase } from '../../helper/NameHelper';

function Sidebar() {
  const [searchParam] = useSearchParams();
  const navigate = useNavigate();

  return (
    <Nav activeKey={filterNamesArray.includes(searchParam.get('filter')) ? searchParam.get('filter') : 'all'} defaultActiveKey="all" className="flex-column" variant='pills'>
      {filterNamesArray.map(filter => {
        const readableFilterName = underscoreToUpperCase(filter);
        return <Nav.Link key={filter} eventKey={filter} onClick={() => navigate({ pathname: '/', search: `?filter=${filter}` }) }>{readableFilterName}</Nav.Link>
      })}
    </Nav>);
  
}

export default Sidebar;