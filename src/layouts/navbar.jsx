import { Navbar, Nav, Container } from 'react-bootstrap';
import { Outlet, NavLink } from 'react-router-dom';

const NavbarExample = () => {
    return (
        <>
            <Navbar variant='dark' sticky="top" style={{ backgroundColor: "#11998e" }} expand="lg">
                <Container>
                    <Navbar.Brand as={NavLink} to="/" >Sistem billing AF</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={NavLink} to="/" ><i className="fa-solid fa-house-chimney"></i> Inicio</Nav.Link>
                            <Nav.Link as={NavLink} to="/Facturacion" ><i className="fa-solid fa-clipboard"></i> Facturación</Nav.Link>
                            <Nav.Link as={NavLink} to="/Product" ><i className="fa-brands fa-product-hunt"></i> Productos</Nav.Link>
                            <Nav.Link as={NavLink} to="/Cliente" ><i className="fa-solid fa-person-circle-plus"></i> Clientes</Nav.Link>
                            <Nav.Link as={NavLink} to="/Comprobantes" ><i className="fa-solid fa-building-circle-exclamation"></i> Comprobantes</Nav.Link>
                            <Nav.Link as={NavLink} to="/consulta" ><i className="fa-solid fa-clipboard-question"></i> Consulta</Nav.Link>
                            <Nav.Link as={NavLink} to="/PrintFact" ><i className="fa-brands fa-r-project"></i> Reporte</Nav.Link>
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
export default NavbarExample