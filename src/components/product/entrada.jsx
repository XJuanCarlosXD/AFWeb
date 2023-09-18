import { Button, Form, Container, Row, Col, Spinner } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DarkButton, DarkInput, LightInput, styleDark, styleDay } from '../../Theme/themes';
import Swal from 'sweetalert2'
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { currency } from '../facturacion/component';

const defaultState = {
    product: "",
    cantidad: "",
    costo: "",
    total: ""
};
const URI = 'http://localhost:8000/Product/';
const URI2 = 'http://localhost:8000/Detalles/Entradas/';
const URI3 = 'http://localhost:8000/Entradas/';
const RowsProduct = ({ onChange, onRemove, cantidad, costo, Check }) => {
    const [producto, setProduct] = useState([]);
    const [input, setInput] = useState('');
    const option = [];
    useEffect(() => {
        getAllProduct();
    }, [])
    const getAllProduct = async () => {
        const res = await axios.get(URI);
        setProduct(res.data);
    };
    const selecValue = ({ value }) => {
        onChange("product", value);
        setInput(value)
    }
    const currency = function (number) {
        return new Intl.NumberFormat("en-EU", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
        }).format(number);
    };
    return (
        <>
            <Form.Group as={Row} className="mb-1" controlId="formPlaintextEmail">
                {
                    producto.forEach(x => {
                        const optione = { label: x.descripcion, value: x.id }
                        option.push(optione);
                    })
                }
                <Col className='mt-4' sm={4}>
                    <Select
                        defaultValue={{ label: "Selecciona Producto", value: "null" }}
                        options={option}
                        onChange={selecValue}
                        theme={theme => ({
                            ...theme,
                            colors: {
                                ...theme.colors,
                                text: "#000",
                                neutral20: "#11998e",
                                primary: "#11998e"
                            }
                        })} />
                    <input value={input} required hidden />
                </Col>
                <Col className='form__group field'>
                    <input
                        type="number"
                        style={!Check ? DarkInput : LightInput}
                        min={1}
                        value={cantidad}
                        className='text-center form__field'
                        onChange={e => { onChange("cantidad", e.target.value) }}
                        placeholder="Cantidad"
                        autoComplete='off'
                        required />
                    <Form.Label className='form__label'>
                        Cantidad
                    </Form.Label>
                </Col>
                <Col className='form__group field'>
                    <input
                        type="number"
                        min={1}
                        style={!Check ? DarkInput : LightInput}
                        value={costo}
                        className='text-center form__field'
                        onChange={e => { onChange("costo", e.target.value) }}
                        placeholder="Costo"
                        autoComplete='off'
                        required />
                    <Form.Label className='form__label'>
                        Costo
                    </Form.Label>
                </Col>
                <Col className='form__group field'>
                    <input
                        type="text"
                        style={!Check ? DarkInput : LightInput}
                        value={currency(costo * cantidad)}
                        className='text-center form__field'
                        onChange={e => { onChange("total", e.target.value) }}
                        readOnly
                        placeholder="Total" />
                    <Form.Label className='form__label'>
                        Total
                    </Form.Label>
                </Col>
                <Col className='mt-4' sm={1}>
                    <Button size='md' onClick={onRemove} variant="danger"><i className="fa-solid fa-minus"></i></Button>
                </Col>
            </Form.Group>
        </>
    );
}
var data = [];
const TProduct = ({ Check }) => {
    const [rows, setRows] = useState([defaultState]);
    data = [];
    data.push(...rows);
    const handleOnChange = (index, name, value) => {
        const copyRows = [...rows];
        copyRows[index] = {
            ...copyRows[index],
            [name]: value
        };
        setRows(copyRows);
    };
    const handleOnAdd = () => {
        setRows(rows.concat(defaultState));
    };
    const handleOnRemove = index => {
        const copyRows = [...rows];
        copyRows.splice(index, 1);
        setRows(copyRows);
    };

    return (
        <div>
            {rows.map((row, index) => (
                <RowsProduct
                    {...row}
                    onChange={(name, value) => handleOnChange(index, name, value)}
                    onRemove={() => handleOnRemove(index)}
                    key={index}
                    Check={Check}
                />
            ))}
            <div className='text-end mt-3'>
                <Button size='md' type='button' variant="success" onClick={handleOnAdd}>
                    <i class="fa-solid fa-plus"></i> Agregar
                </Button>
            </div>
        </div>
    );
}
const EntradaP = ({ Check }) => {
    const [validated, setValidated] = useState(false);
    const [click, setClick] = useState(false);
    const [tCosto, setCosto] = useState(0);
    const [tCantidad, setCantidad] = useState(0);
    const [contador, setContador] = useState([]);
    const [detalle, setDetalle] = useState('');
    const [number, setNumber] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        getAllDetalle();
        getTotales();
    }, [])
    useEffect(() => {
        getContador();
    })
    const getTotales = () => {
        var o = 0; var c = 0;
        for (let i = 0; i < data.length; i++) {
            o = o + parseFloat(data[i].costo) * parseFloat(data[i].cantidad);
            c = c + parseFloat(data[i].cantidad);
        }
        setCantidad(c);
        setCosto(o);
    }
    const getAllDetalle = async () => {
        const res = await axios.get(URI2);
        setContador(res.data);
    };
    const getContador = () => {
        setNumber(contador.length + 1);
    }
    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
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
            event.preventDefault();
            getContador();
            setClick(true)
            await axios.post(URI2, {
                detalle: detalle,
            })
            for (let i = 0; i < data.length; i++) {
                var res = await axios.post(URI3, {
                    noEntrada: number,
                    producto: data[i].product,
                    cantidad: data[i].cantidad,
                    costo: data[i].costo,
                    total: data[i].costo * data[i].cantidad,
                })
            }
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
            navigate('/');
        }

        setValidated(true);
    };
    return (
        <>
            <Container className='mt-5 mb-3 p-md-5 rounded' style={Check ? styleDay : styleDark}>
                <Form noValidate validated={validated} onBlur={getTotales} onSubmit={handleSubmit}>
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextTitle">
                        <Col sm={7}>
                            <h2 className="fw-bold">Entrada Inventario</h2>
                        </Col>
                        <Col sm="5">
                            <h3 className="fw-light text-end">Entrada No. 00000000{number}</h3>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextDetalle">
                        <Col className='form__group field'>
                            <textarea
                                style={!Check ? DarkInput : LightInput}
                                className='form__field'
                                name="detalle"
                                placeholder='detalle'
                                value={detalle}
                                onChange={e => { setDetalle(e.target.value) }} />
                            <Form.Label className='form__label'>
                                Detalle
                            </Form.Label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                        <Col className='text-end'>
                            {click ? (
                                <Button size='md' type='submit' style={Check ? DarkButton : {}} variant="light" disabled>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    /> Save</Button>
                            ) : (
                                <Button size='md' type='submit' style={Check ? DarkButton : {}} variant="light"><i className="fa-regular fa-floppy-disk"></i> Save</Button>
                            )}

                        </Col>
                    </Form.Group>
                    <TProduct Check={Check} />
                </Form>
            </Container>
            <Container className='mt-3 mb-2 p-md-5 rounded' style={Check ? styleDay : styleDark}>
                <Form.Group as={Row} className="mb-3 d-flex justify-content-end" controlId="formPlaintextTitle">
                    <Col className='form__group field'>
                        <input
                            type='text'
                            style={!Check ? DarkInput : LightInput}
                            className='form__field text-center'
                            placeholder='total'
                            value={currency(tCosto)}
                            readOnly />
                        <Form.Label className='form__label'>
                            Total Entrada
                        </Form.Label>
                    </Col>
                    <Col className='form__group field'>
                        <input
                            type='text'
                            style={!Check ? DarkInput : LightInput}
                            className='text-center form__field'
                            value={tCantidad}
                            readOnly />
                        <Form.Label className='form__label'>
                            Total Cantidad:
                        </Form.Label>
                    </Col>
                </Form.Group>
            </Container>
        </>
    )
}
export default EntradaP