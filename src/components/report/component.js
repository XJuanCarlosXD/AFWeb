import React, { useEffect, useState } from 'react';
import { Form, Container, Row, Col, Card, InputGroup, Table } from 'react-bootstrap';
import logo2 from './logo-w1 .png';
import Select from 'react-select';
import { currency, zerofill } from '../facturacion/component';
import axios from 'axios';

const URIFA = 'http://localhost:8000/Factura/';

export const ComponentToPrint = React.forwardRef((props, ref) => {
    const styleDay = {
        color: "#233740",
    };
    return (
        <div ref={ref}>
            <Container>
                <Card>
                    <Card.Img variant="top" src={logo2} />
                    <Card.Body>
                        <Form.Group as={Row} controlId="formPlaintextEmail">
                            <Col className='text-start'>
                                <h3 className="fw-semibold fs-4" style={styleDay}>Factura No. {zerofill(props.nofactura)}</h3>
                            </Col>
                            <Col className='text-end'>
                                <h2 className="fw-semibold fs-4" style={styleDay}>NCF {props.ncf + ' ' + zerofill(props.nocomprobante)}</h2>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextEmail">
                            <Col className='text-start'>
                                <h2 className="fw-light fs-6" style={styleDay} >Fecha Factura: {new Date(props.date).toLocaleDateString()} </h2>
                            </Col>
                            <Col className='text-end'>
                                <h2 className="fw-light fs-6" style={styleDay}>{props.nameNcf}</h2>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextEmail">
                            <Col className='text-end'>
                                <h2 className="fw-light fs-6" style={styleDay}>Valido hasta {new Date(props.datev).toLocaleDateString()}</h2>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextEmail">
                            <Col>
                                <InputGroup size="sm">
                                    <InputGroup.Text className='fw-semibold'><i className="fa-solid fa-user"></i> Cliente</InputGroup.Text>
                                    <Form.Control className="text-end form-field" readOnly value={props.client} />
                                    <InputGroup.Text className='fw-semibold'><i className="fa-solid fa-address-card"></i> RNC</InputGroup.Text>
                                    <Form.Control className="text-end" readOnly value={props.rnc} />
                                </InputGroup>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextEmail">
                            <Col>
                                <InputGroup size="sm">
                                    <InputGroup.Text className='fw-semibold'><i className="fa-solid fa-map-location-dot"></i> Dirreción</InputGroup.Text>
                                    <Form.Control className="text-end" readOnly value={props.address} />
                                </InputGroup>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextEmail">
                            <Col>
                                <InputGroup size="sm">
                                    <InputGroup.Text className='fw-semibold'><i className="fa-solid fa-at"></i> Email</InputGroup.Text>
                                    <Form.Control className="text-end" readOnly value={props.email} />
                                    <InputGroup.Text className='fw-semibold'><i className="fa-solid fa-phone"></i> Telefono</InputGroup.Text>
                                    <Form.Control className="text-end" readOnly value={props.phone} />
                                </InputGroup>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-1" controlId="formPlaintextEmail">
                            <Col>
                                <InputGroup size="sm">
                                    <InputGroup.Text className='fw-semibold'><i className="fa-solid fa-hand-holding-dollar"></i> Condicion Pago</InputGroup.Text>
                                    <Form.Control className="text-end" readOnly value={props.pago} />
                                    <InputGroup.Text className='fw-semibold'><i className="fa-solid fa-user-tie"></i> Vendedor</InputGroup.Text>
                                    <Form.Control className="text-end" readOnly value={props.vendedor} />
                                </InputGroup>
                            </Col>
                        </Form.Group>
                    </Card.Body>
                </Card>
                <Card>
                    <TableFac rows={props.rows} />
                </Card>
            </Container>
        </div>
    );
});
export const SelectFac = ({ onChange, Rows }) => {
    const option = [];
    const [client, setClient] = useState([]);
    useEffect(() => {
        getdeFactura();
    }, [])
    const handleSelectChange = async ({ value }) => {
        const res = await axios.get(URIFA + 'Detalle/' + value)
        onChange(res.data[0]);
        const response = await axios.get(URIFA + 'Productos/' + value);
        Rows(response.data);
    };
    const getdeFactura = async () => {
        const res = await axios.get(URIFA + 'Detalle/');
        setClient(res.data);
    };
    return (
        <>
            <Container className='mt-3 mb-3'>
                {
                    client.forEach(x => {
                        const date = new Date(x.createdAt).toLocaleDateString();
                        const optione = { label: `FC-${zerofill(x.id)} Fecha de Creacion: ${date} ${x.cliente.nombre}`, value: x.id }
                        option.push(optione)
                    })
                }
                <Select
                    defaultValue={{ label: "Selecciona una Factura", value: "null" }}
                    options={option}
                    onChange={handleSelectChange}
                    theme={theme => ({
                        ...theme,
                        colors: {
                            ...theme.colors,
                            text: "orangered",
                            neutral20: "#11998e",
                            primary: "#11998e"
                        }
                    })}
                />
            </Container>
        </>
    )
};
const TableFac = ({ rows }) => {
    return (
        <>
            <Table className='text-center' size="sm" striped>
                <thead className='bg-light-green'>
                    <tr>
                        <th>#</th>
                        <th>Descripcion</th>
                        <th>Catidad</th>
                        <th>Precio</th>
                        <th>Descuento</th>
                        <th>Total Neto</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((x, index) => (
                        <tr key={x.id}>
                            <td>{index + 1}</td>
                            <td>{(x.producto.descripcion)}</td>
                            <td>{x.cantidad}</td>
                            <td>{currency(x.precio)}</td>
                            <td>{0.00}</td>
                            <td>{currency(x.monto)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot className='bg-light-green'>
                    <tr>
                        <th>#</th>
                        <th>Descripcion</th>
                        <th>Catidad</th>
                        <th>Precio</th>
                        <th>Descuento</th>
                        <th>Total Neto</th>
                    </tr>
                </tfoot>
            </Table>
        </>
    )
};