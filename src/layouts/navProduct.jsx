import { Navbar, Nav, Container } from 'react-bootstrap';
import { Outlet, NavLink } from 'react-router-dom';

const NavProduct = () => {
    return (
        <>
            <Navbar variant='dark' sticky="top" style={{ backgroundColor: "#11998e" }} expand="lg">
                <Container>
                    <Navbar.Brand as={NavLink} to="/" >Sistem billing AF</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={NavLink} to="/Product"><i className="fa-solid fa-cart-plus"></i> New Productos</Nav.Link>
                            <Nav.Link as={NavLink} to="/Product/Entradas" ><i className="fa-solid fa-box-open"></i> Entradas</Nav.Link>
                            <Nav.Link as={NavLink} to="/Product/Reporte" ><i className="fa-brands fa-r-project"></i> Reporte</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <section>
                <Outlet></Outlet>
            </section>
        </>
    )
}
export default NavProduct