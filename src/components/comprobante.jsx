import { Button, Form, Container, Row, Col, Table, InputGroup } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { DarkButton, DarkInput, LightInput, styleDark, styleDay } from '../Theme/themes';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { applyInputMask, zerofill } from './facturacion/component';

const URI = 'http://localhost:8000/Comprobantes/'

const Fcomprobante = ({ Check }) => {
    const [validated, setValidated] = useState(false);
    const [rows, setRows] = useState([]);
    const [ncf, setNCF] = useState('');
    const [descripcion, setDescripcion] = useState(null);
    const [date, setDate] = useState('');
    const [inicial, setInicial] = useState(1);
    const [final, setFinal] = useState(1);
    const [siguiente, setSiguiente] = useState(1);
    const [activo, setActivo] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        getAllComprobante();
    }, [])
    const handleSubmit = async (e) => {
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            e.preventDefault();
            const res = await axios.post(URI, {
                noNcf: ncf,
                descripcion: descripcion,
                dateV: date,
                inicial: inicial,
                final: final,
                siguiente: siguiente,
                activo: activo
            });
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })
            Toast.fire({
                icon: res.data.icon,
                title: res.data.message
            })
            navigate('/Facturacion');
        }

        setValidated(true);
    };
    const getAllComprobante = async () => {
        const res = await axios.get(URI)
        setRows(res.data);
    };
    return (
        <>
            <Container className='mt-5 mb-3 p-md-5 rounded' style={Check ? styleDay : styleDark}>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextInfo">
                        <Col className='text-start'>
                            <h2 className="fw-bold">Comprobante</h2>
                        </Col>
                        <Col className='text-end'>
                            <h3 className="fw-light text-end">NCF No. 000000001</h3>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextname">
                        <Col className='form__group field'>
                            <InputGroup hasValidation>
                                <input
                                    className='form__field'
                                    type="text"
                                    id='ncf'
                                    autoComplete='off'
                                    value={ncf}
                                    onChange={e => { setNCF(e.target.value); applyInputMask('ncf', 'B00', 1) }}
                                    placeholder=' Numero NCF' required />
                                <Form.Control.Feedback type="invalid">
                                    Por Favor Escribe un numero NCF.
                                </Form.Control.Feedback>
                            </InputGroup>
                            <Form.Label className='form__label'>
                                Numero NCF
                            </Form.Label>
                        </Col>
                        <Col className='form__group field'>
                            <InputGroup hasValidation>
                                <input
                                    style={!Check ? DarkInput : LightInput}
                                    className='form__field'
                                    type="text"
                                    autoComplete='off'
                                    value={descripcion}
                                    onChange={e => { setDescripcion(e.target.value) }}
                                    placeholder='Descripción'
                                    required />
                                <Form.Control.Feedback type="invalid">
                                    Por Favor Escribe una descripción.
                                </Form.Control.Feedback>
                            </InputGroup>
                            <Form.Label className='form__label'>
                                Descripción
                            </Form.Label>
                        </Col>
                        <Col className='form__group field'>
                            <input
                                style={!Check ? DarkInput : LightInput}
                                className='form__field text-center'
                                type="date"
                                autoComplete='off'
                                value={date}
                                onChange={e => { setDate(e.target.value) }}
                                required />
                            <Form.Label className='form__label'>
                                Fecha Vencimiento
                            </Form.Label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextname">
                        <Col className='form__group field'>
                            <input
                                style={!Check ? DarkInput : LightInput}
                                className='form__field text-center'
                                type="number"
                                autoComplete='off'
                                min={1}
                                value={zerofill(inicial)}
                                onChange={e => { setInicial(e.target.value) }}
                                placeholder='Inicial' required />
                            <Form.Label className='form__label'>
                                NCF Inicial
                            </Form.Label>
                        </Col>
                        <Col className='form__group field'>
                            <input
                                style={!Check ? DarkInput : LightInput}
                                className='form__field text-center'
                                type="number"
                                value={zerofill(final)}
                                min={1}
                                autoComplete='off'
                                onChange={e => { setFinal(e.target.value) }}
                                placeholder='Final'
                                required />
                            <Form.Label className='form__label'>
                                NCF Final
                            </Form.Label>
                        </Col>
                        <Col className='form__group field'>
                            <input
                                style={!Check ? DarkInput : LightInput}
                                className='form__field text-center'
                                type="number"
                                value={zerofill(siguiente)}
                                min={1}
                                autoComplete='off'
                                onChange={e => { setSiguiente(e.target.value) }}
                                placeholder='Siguiente'
                                required />
                            <Form.Label className='form__label'>
                                NCF Siguiente
                            </Form.Label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextname">
                        <Col sm={2}>
                            <Form.Check
                                type='switch'
                                id="active"
                                value={activo}
                                checked={!!activo}
                                onChange={e => { setActivo(e.target.value) }}
                                label="Activo"
                                required />
                        </Col>
                        <Col className='d-flex justify-content-end'>
                            <Button size='md' type='submit' variant="light" style={Check ? DarkButton : {}}><i className="fa-regular fa-floppy-disk"></i> Save</Button>
                        </Col>
                    </Form.Group>
                </Form>
            </Container>
            <Container className='mb-3 p-md-5 rounded' style={Check ? styleDay : styleDark}>
                <h2 className="fw-bold mb-3">Estado NCF</h2>
                <Table striped responsive="sm">
                    <thead style={Check ? styleDay : styleDark}>
                        <tr>
                            <th>#NCF</th>
                            <th>Descripción</th>
                            <th>NCF Inicial</th>
                            <th>NCF Final</th>
                            <th>NCF Siguiente</th>
                            <th>Inventario NCF</th>
                            <th>Fecha Vencimiento</th>
                        </tr>
                    </thead>
                    <tbody className='bg-light-green'>
                        {rows.map((row) => (
                            <tr key={row.id}>
                                <td>{row.noNcf}</td>
                                <td>{row.descripcion}</td>
                                <td>{row.inicial}</td>
                                <td>{row.final}</td>
                                <td>{row.siguiente}</td>
                                <td>{row.final - row.inicial}</td>
                                <td>{row.dateV}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Container>
        </>
    )
}

export default Fcomprobante;