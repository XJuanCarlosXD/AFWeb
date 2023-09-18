import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { DarkButton, DarkInput, DarkSelect, LightInput, styleDark, styleDay } from '../../Theme/themes';
import Swal from 'sweetalert2'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

const URI = 'http://localhost:8000/Product/';

const Product = ({ Check }) => {
    const option = [];
    const [show, setShow] = useState(false);
    const [Desc, setDesc] = useState(false);
    const [svalue, setsValue] = useState(0);
    const [product, setProduct] = useState([]);
    const [search, setSearch] = useState(false);
    const [validated, setValidated] = useState(false);
    const [descripcion, setDescricion] = useState('');
    const [especifi, setEspecifi] = useState('');
    const [tipo, setTipo] = useState(0);
    const [impuesto, setImpuesto] = useState('');
    const [descuento, setDescuento] = useState('');
    const [activo, setActivo] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getAllProduct();
    }, []);
    const getAllProduct = async () => {
        const res = await axios.get(URI);
        setProduct(res.data);
        for (let i = 0; i < res.data.length; i++) {
            var oio = res.data[i].id + 1
        }
        setsValue(oio)
    };
    const handleSelectChange = async ({ value }) => {
        const res = await axios.get(URI + value);
        setDescricion(res.data[0].descripcion);
        setEspecifi(res.data[0].especificaciones);
        setTipo(res.data[0].tipo);
        setShow(res.data[0].activeImp);
        setDesc(res.data[0].activeDes);
        setImpuesto(res.data[0].impuestos);
        setDescuento(res.data[0].descuentos);
        setActivo(res.data[0].active);
        setsValue(value);
    };
    const handleSubmit = async (e) => {
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
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
                icon: 'error',
                title: 'Campos vacio verifique!'
            })
        } else {
            e.preventDefault();
            const res = await axios.post(URI, {
                descripcion: descripcion,
                especificaciones: especifi,
                tipo: tipo,
                activeImp: show,
                impuestos: impuesto,
                activeDes: Desc,
                descuentos: descuento,
                active: activo
            })
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
            navigate('/Product/Entradas');
        }

        setValidated(true);
    };
    const handleUpdate = async (e) => {
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.preventDefault();
            e.stopPropagation();
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
                icon: 'error',
                title: 'Campos vacio verifique!'
            })
        } else {
            e.preventDefault();
            const res = await axios.put(URI + svalue, {
                descripcion: descripcion,
                especificaciones: especifi,
                tipo: tipo,
                activeImp: show,
                impuestos: impuesto,
                activeDes: Desc,
                descuentos: descuento,
                active: activo
            })
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
        }
    };
    return (
        <>
            <Container className='mt-5 mb-3 p-md-5 rounded' style={Check ? styleDay : styleDark}>
                <Form noValidate validated={validated} onSubmit={!search ? handleSubmit : handleUpdate}>
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                        <Col sm={7}>
                            <h2 className="fw-bold">Inventario</h2>
                        </Col>
                        <Col sm="5">
                            <h3 className="fw-light text-end">Producto No. 00000000{svalue}</h3>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                        <Col sm={3}>
                            <Form.Check
                                type='switch'
                                label='Buscar Producto'
                                id='search'
                                autoComplete='off'
                                value={search}
                                checked={search}
                                onChange={e => { setSearch(e.target.checked) }}
                            />
                        </Col>
                        {!search ? ("") :
                            (<>
                                {
                                    product.forEach(x => {
                                        const optione = { label: x.descripcion, value: x.id }
                                        option.push(optione)
                                    })
                                }
                                < Col sm={9}>
                                    <Select
                                        defaultValue={{ label: "Selecciona Producto", value: "empty" }}
                                        options={option}
                                        onChange={handleSelectChange}
                                        theme={theme => ({
                                            ...theme,
                                            colors: {
                                                ...theme.colors,
                                                text: "#000",
                                                neutral20: "#11998e",
                                                primary: "#11998e"
                                            }
                                        })} />
                                </Col>
                            </>)}
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                        <Col className='form__group field' sm={7}>
                            <input
                                style={!Check ? DarkInput : LightInput}
                                type="text"
                                value={descripcion}
                                autoComplete='off'
                                placeholder='descripcion'
                                className='form__field'
                                onChange={e => { setDescricion(e.target.value) }}
                                required />
                            <Form.Label className='form__label'>
                                Descripción
                            </Form.Label>
                        </Col>
                        <Col className='form__group field' sm={4}>
                            <input
                                style={!Check ? DarkInput : LightInput}
                                type="text"
                                value={especifi}
                                className='form__field'
                                autoComplete='off'
                                placeholder='especificacion'
                                onChange={e => { setEspecifi(e.target.value) }}
                                required />
                            <Form.Label className='form__label'>
                                Especificaciones
                            </Form.Label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                        <Col className='form__group field' sm={3}>
                            <select value={tipo} style={!Check ? DarkSelect : LightInput} onChange={e => { setTipo(e.target.value) }} className='form__field'>
                                <option></option>
                                <option value="1">Inventario</option>
                                <option value="2">Servicio</option>
                            </select>
                            <Form.Label className='form__label'>
                                Tipo
                            </Form.Label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                        <Col sm="2">
                            <Form.Check
                                type="switch"
                                id="switch-1"
                                value={show}
                                checked={show}
                                onChange={e => { setShow(e.target.checked) }}
                                label="Tiene Impuesto"
                            />
                        </Col>
                        <Col sm="2">
                            <Form.Check
                                type="switch"
                                id="switch-2"
                                label="Descuento"
                                value={Desc}
                                checked={Desc}
                                onChange={e => { setDesc(e.target.checked); }}
                            />
                        </Col>
                        <Col sm="2">
                            <Form.Check
                                type="switch"
                                id="switch-4"
                                label="Activo"
                                value={activo}
                                checked={activo}
                                onChange={e => { setActivo(e.target.checked) }}
                            />
                        </Col>
                        <Col className='d-flex justify-content-end'>
                            <Button size='md' type='submit' style={Check ? DarkButton : {}} variant="light"><i className="fa-regular fa-floppy-disk"></i> {!search ? 'Save' : 'Update'}</Button>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                        {show ? (
                            <Col className='form__group field' sm="2">
                                <input
                                    style={!Check ? DarkInput : LightInput}
                                    type="number"
                                    placeholder="Impuestos%"
                                    className='form__field text-center'
                                    value={impuesto}
                                    autoComplete='off'
                                    min={1}
                                    onChange={e => { setImpuesto(e.target.value) }}
                                    required
                                />
                                <Form.Label className='form__label'>
                                    Impuestos
                                </Form.Label>
                            </Col>
                        ) : ('')}
                        {Desc ? (
                            <Col className='form__group field' sm="2">
                                <input
                                    style={!Check ? DarkInput : LightInput}
                                    type="number"
                                    value={descuento}
                                    min={1}
                                    className='form__field text-center'
                                    autoComplete='off'
                                    onChange={e => { setDescuento(e.target.value) }}
                                    placeholder="Max Descuento%"
                                    required />
                                <Form.Label className='form__label'>
                                    Descuento
                                </Form.Label>
                            </Col>
                        ) : ('')}
                    </Form.Group>
                </Form>
            </Container>
        </>
    )
}
export default Product