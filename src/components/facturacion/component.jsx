import { Button, Form, Container, Row, Col, InputGroup, Spinner, Accordion } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { styleDark, styleDay } from '../../Theme/themes';
import Select from 'react-select';
import axios from 'axios';
import { toast } from "react-hot-toast";

const URIP = 'http://localhost:8000/Product/';
const URIC = 'http://localhost:8000/Client/';
const URIFA = 'http://localhost:8000/Factura/';
const URIDE = 'http://localhost:8000/DetalleClientes/'

const defaultState = {
    product: "",
    cantidad: "",
    precio: "",
    descuento: "",
    impuesto: "",
};
const Rows = ({ onChange, onRemove, cantidad, precio, descuento }) => {
    const produtos = [];
    const [prod, setProduct] = useState([]);
    const [impuesto, setImpuesto] = useState(0);
    const [desc, setDesc] = useState(0);
    useEffect(() => {
        getProduct();
    }, [])
    const getProduct = async () => {
        const res = await axios.get(URIP);
        setProduct(res.data);
    };
    const validation = (e) => {
        if (e.target.value > desc) {
            toast.info("El descuento no puede ser mayor de lo establecido!");
        } else {
            onChange("descuento", e.target.value);
        }
    };
    const handleOnChange = async ({ value }) => {
        const res = await axios.get(URIP + value);
        setImpuesto(res.data[0].impuestos);
        setDesc(res.data[0].descuentos);
        onChange("product", value);
    };
    return (
        <>
            <Row className="mb-1">
                <Form.Group as={Col} sm={4} className="form__group field mt-2" controlId="formPlaintextEmail">
                    {
                        prod.forEach(x => {
                            const data = { label: x.descripcion, value: x.id }
                            produtos.push(data)
                        })
                    }
                    <InputGroup>
                        <Col sm={2} >
                            <Button size='md' className='rounded' onClick={onRemove} variant="outline-danger"><i className="fa-solid fa-minus"></i></Button>
                        </Col>
                        <Col sm={10} >
                            <Select
                                defaultValue={{ label: "Selecciona Producto", value: "null" }}
                                options={produtos}
                                onChange={handleOnChange}
                                theme={theme => ({
                                    ...theme,
                                    colors: {
                                        ...theme.colors,
                                        text: "orangered",
                                        neutral20: "#11998e",
                                        primary: "black"
                                    }
                                })} />
                        </Col>
                    </InputGroup>
                </Form.Group>
                <Form.Group as={Col} sm={2} className="form__group field" controlId="formPlaintextEmail">
                    <InputGroup hasValidation>
                        <input
                            type="number"
                            min={0}
                            step={0.01}
                            className='text-center form__field'
                            autoComplete='off'
                            value={cantidad}
                            onChange={e => { onChange("cantidad", e.target.value) }}
                            onBlur={() => { onChange('impuesto', impuesto) }}
                            placeholder="Cantidad"
                            required />
                        <Form.Control.Feedback type="invalid">
                            Escribe una Cantidad.
                        </Form.Control.Feedback>
                    </InputGroup>
                    <Form.Label className='form__label'>
                        Cantidad
                    </Form.Label>
                </Form.Group>
                <Form.Group as={Col} sm={2} className="form__group field" controlId="formPlaintextEmail">
                    <InputGroup hasValidation>
                        <input
                            type="number"
                            min={0}
                            step={0.01}
                            autoComplete='off'
                            className='text-center form__field'
                            value={precio}
                            onChange={e => { onChange("precio", e.target.value) }}
                            placeholder="Precio"
                            required />
                        <Form.Control.Feedback type="invalid">
                            Escribe un Precio.
                        </Form.Control.Feedback>
                    </InputGroup>
                    <Form.Label className='form__label'>
                        Precio
                    </Form.Label>
                </Form.Group>
                <Form.Group as={Col} sm={2} className="form__group field" controlId="formPlaintextEmail">
                    <input
                        type="number"
                        min={0}
                        max={desc}
                        autoComplete='off'
                        className='text-center form__field'
                        value={descuento}
                        onChange={validation}
                        placeholder="Descuento%" />
                    <Form.Label className='form__label'>
                        Descuento
                    </Form.Label>
                </Form.Group>
                <Form.Group as={Col} sm={2} className="form__group field" controlId="formPlaintextEmail">
                    <input
                        type="text"
                        className='text-center form__field'
                        value={currency(parseFloat(cantidad * precio) / parseFloat('1.' + padLeadingZeros(descuento)) * parseFloat('1.' + impuesto))}
                        readOnly
                        placeholder="Monto" />
                    <Form.Label className='form__label'>
                        Monto
                    </Form.Label>
                </Form.Group>
            </Row>
        </>

    );
};
const Footer = ({ subtotal, tdescuento, timpuesto, totalN }) => {
    return (
        <>
            <Container className="fixed-bottom rounded mt-5" style={{ "background-color": "#11998e" }}>
                <Row>
                    <Form.Group as={Col} sm={3} className="form__group field" controlId="formPlaintextEmail">
                        <input
                            className='text-end form__field frm_op'
                            value={currency(subtotal)}
                            placeholder="SubTotal"
                            readOnly />
                        <Form.Label className='form__label frm_op'>
                            Sub Total
                        </Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} sm={3} className="form__group field" controlId="formPlaintextEmail">
                        <input
                            className='text-end form__field frm_op'
                            readOnly
                            value={currency(tdescuento)}
                            placeholder="Descuento" />
                        <Form.Label className='form__label frm_op'>
                            Total Descuento
                        </Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} sm={3} className="form__group field" controlId="formPlaintextEmail">
                        <input
                            className='text-end form__field frm_op'
                            readOnly
                            value={currency(timpuesto)}
                            placeholder="Impuesto" />
                        <Form.Label className='form__label frm_op'>
                            Total Impuesto
                        </Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} sm={3} className="form__group s " controlId="formPlaintextEmail">
                        <input
                            className='text-end form__field frm_op'
                            readOnly
                            value={currency(totalN)}
                            placeholder="Neto" />
                        <Form.Label className='form__label frm_op'>
                            Total Neto
                        </Form.Label>
                    </Form.Group>
                </Row>
            </Container>
        </>
    )
};
const Header = ({ input, client, direc, handleSelectChange, ncf, nancf, detalle, ordenc, rnc, vendedor, diapago, pago, dipago }) => {
    const option = [];
    const cardStyle = {
        opacity: input === '' ? 0 : 1,
        transition: "all 1s ease-in"
    };
    return (
        <>
            <Row className="mb-3">
                <Form.Group as={Col} sm={6} className='mt-4' controlId="formPlaintextEmail">
                    {
                        client.forEach(x => {
                            const optione = { label: x.nombre, value: x.id }
                            option.push(optione)
                        })
                    }
                    <Select
                        defaultValue={{ label: "Selecciona un Cliente", value: "null" }}
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
                    <Form.Control type="text" value={input} required hidden />
                </Form.Group>
                <Form.Group style={cardStyle} sm={6} as={Col} className='form__group field'>
                    <input
                        value={direc}
                        className={'form__field'}
                        placeholder="Dirección"
                        readOnly />
                    <Form.Label className='form__label'>
                        Dirección
                    </Form.Label>
                </Form.Group>
            </Row>
            <Row style={cardStyle} className="mb-3">
                {input === '' ? '' : (
                    <>
                        <Form.Group as={Col} sm={3} style={cardStyle} className='form__group field'>
                            <input
                                value={ncf}
                                className={'form__field'}
                                placeholder="Ncf"
                                readOnly />
                            <Form.Label className='form__label'>
                                NCF
                            </Form.Label>
                        </Form.Group>
                        <Form.Group as={Col} sm={3} style={cardStyle} className='form__group field'>
                            <input
                                className={'form__field'}
                                placeholder="Siguiente"
                                value={nancf}
                                readOnly />

                            <Form.Label className='form__label'>
                                Siguiente
                            </Form.Label>
                        </Form.Group>
                        <Form.Group as={Col} sm={3} style={cardStyle} className='form__group field mt-1'>
                            <InputGroup hasValidation>
                                <select onChange={e => { pago(e.target.value) }} className='form__field' required>
                                    <option></option>
                                    <option value="Efectivo">Efectivo</option>
                                    <option value="Credito">Credito</option>
                                    <option value="Cheque/Trasferencia">Cheque/Trasferencia</option>
                                    <option value="Tarjeta Credito/Debito">Tarjeta Credito/Debito</option>
                                    <option value="Otras Formas de Pago">Otras Formas de Pago</option>
                                </select>
                                <Form.Control.Feedback type="invalid">
                                    Por Favor Seleciona Forma de Pago.
                                </Form.Control.Feedback>
                            </InputGroup>
                            <Form.Label className='form__label'>
                                Forma de Pago
                            </Form.Label>
                        </Form.Group>
                        <Form.Group as={Col} sm={3} style={cardStyle} className='form__group field mt-1'>
                            <InputGroup hasValidation>
                                <select value={dipago} className='form__field text-center' onChange={e => { diapago(e.target.value); dipago(e.target.value) }} required>
                                    <option></option>
                                    <option value="30">30</option>
                                    <option value="60">60</option>
                                    <option value="5">Inmediato</option>
                                </select>
                                <Form.Control.Feedback type="invalid">
                                    Por Favor Seleciona Plazo de Pago.
                                </Form.Control.Feedback>
                            </InputGroup>
                            <Form.Label className='form__label'>
                                Plazo de Pago
                            </Form.Label>
                        </Form.Group>
                    </>
                )}
            </Row>
            <Row style={cardStyle} className="mb-3">
                {input === '' ? '' : (
                    <>
                        <Form.Group as={Col} sm={4} style={cardStyle} className='form__group field'>
                            <InputGroup hasValidation>
                                <input
                                    type="text"
                                    onChange={e => { vendedor(e.target.value) }}
                                    placeholder="Nombre Vendedor"
                                    className='form__field'
                                    required />
                                <Form.Control.Feedback type="invalid">
                                    Por Favor Desscribe el Vendedor.
                                </Form.Control.Feedback>
                            </InputGroup>
                            <Form.Label className='form__label'>
                                Vendedor
                            </Form.Label>
                        </Form.Group>
                        <Form.Group as={Col} sm={4} style={cardStyle} className='form__group field'>
                            <input
                                type="text"
                                value={rnc}
                                placeholder="Numero RNC/Cedula"
                                className='form__field'
                                readOnly />
                            <Form.Label className='form__label'>
                                RNC
                            </Form.Label>
                        </Form.Group>
                        <Form.Group as={Col} sm={4} style={cardStyle} className='form__group field'>
                            <input
                                type="text"
                                onChange={e => { ordenc(e.target.value) }}
                                placeholder="Orden de Compra"
                                className='form__field' />
                            <Form.Label className='form__label'>
                                Orden de Compra
                            </Form.Label>
                        </Form.Group>
                    </>
                )}
            </Row>
            <Row style={cardStyle} className="mb-3">
                {input === '' ? '' : (
                    <>
                        <Form.Group as={Col} style={cardStyle} className='form__group field'>
                            <input
                                onChange={e => { detalle(e.target.value) }}
                                as="textarea"
                                rows={2}
                                placeholder="Detalle de Factura"
                                className='form__field' />
                            <Form.Label className='form__label'>
                                Detalle de Factura
                            </Form.Label>
                        </Form.Group>
                    </>
                )}
            </Row>
        </>
    )
};
export const TableFact = ({Check}) => {
    const [rows, setRows] = useState([defaultState]);
    const [validated, setValidated] = useState(false);
    const [subtotal, setSubtotal] = useState(0);
    const [descuento, setDescuento] = useState(0);
    const [impuesto, setImpuesto] = useState(0);
    const [totaln, setTotaln] = useState(0);
    const [click, setClick] = useState(false);
    const [client, setClient] = useState([]);
    const [direc, setDirec] = useState(null);
    const [ncf, setNCF] = useState(null);
    const [nancf, setnaNcf] = useState(null);
    const [rnc, setRnc] = useState(null);
    const [input, setInput] = useState('');
    const [pago, setPago] = useState(null);
    const [diapago, setDiapago] = useState(null);
    const [vendedor, setVendedor] = useState(null);
    const [ordenc, setOrdenc] = useState(null);
    const [detalle, setDetalle] = useState(null);
    const [number, setNumber] = useState(0);
    const handleOnChange = (index, name, value) => {
        const copyRows = [...rows];
        copyRows[index] = {
            ...copyRows[index],
            [name]: value
        };
        setRows(copyRows);
    };
    const carbutton = {
        opacity: input === '' ? 0 : 1,
        width: '7em',
        transition: "all 1s ease-in"
    };
    const handleOnAdd = () => {
        setRows(rows.concat(defaultState));
    };
    const handleOnRemove = index => {
        const copyRows = [...rows];
        copyRows.splice(index, 1);
        setRows(copyRows);
    };
    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            toast.error("Oops! Campos vacios.");
        } else {
            event.preventDefault();
            if (rows.length === 0) {
                toast.error("Oops! Campos vacios.");
            } else {
                setClick(true);
                await axios.post(URIFA + 'Detalle/', {
                    clienteId: input,
                    comprobante: ncf,
                    noNcf: nancf,
                    formaPago: pago,
                    plazoPago: diapago,
                    vendedor: vendedor,
                    ordenC: ordenc,
                    detalle: detalle,
                }).catch((e, error) => {
                    console.log(error);
                    toast.error('Opps! a occurrido un error');
                    e.stopPropagation();
                })

                try {
                    for (let i = 0; i < rows.length; i++) {
                        var res = await axios.post(URIFA + 'Productos/', {
                            noFactura: number,
                            productoId: rows[i].product,
                            cantidad: rows[i].cantidad,
                            precio: rows[i].precio,
                            descuento: rows[i].descuento,
                            monto: parseFloat(rows[i].cantidad) * parseFloat(rows[i].precio) / parseFloat('1.' + padLeadingZeros(rows[i].descuento)) * parseFloat('1.' + padLeadingZeros(rows[i].impuesto))
                        })
                    }
                    document.getElementById("form-1").reset();
                    setClick(false);
                    setDirec('');
                    setNCF('');
                    setnaNcf('');
                    setRnc('');
                    setInput('');
                    setRows([defaultState]);
                    toast.success(res.data.message);
                } catch (error) {
                    toast.error('Opps! a occurrido un error');
                }
            }
        }
        setValidated(true);
    };
    const SelectChange = async (value) => {
        const res = await axios.get(URIDE + value);
        setDirec(res.data[0].provincia.nombre + ' ' + res.data[0].calle);
        setNCF(res.data[0].comprobante.noNcf);
        setnaNcf(zerofill(res.data[0].comprobante.siguiente));
        setRnc(res.data[0].identificacion);
        setInput(value);
    };
    const getFact = async () => {
        const res = await axios.get(URIFA + 'Detalle/');
        setNumber(res.data.length + 1);
    };
    const getClient = async () => {
        const res = await axios.get(URIC);
        setClient(res.data);
    };
    useEffect(() => {
        getTotales();
        getFact();
    });
    useEffect(() => {
        getClient();
    }, []);
    const getTotales = () => {
        var sub = 0; var desc = 0; var imp = 0; var ton = 0;
        rows.forEach(x => {
            sub = sub + parseFloat(x.cantidad * x.precio) / parseFloat('1.' + padLeadingZeros(x.descuento));
            desc = desc + parseFloat(x.cantidad * x.precio) - parseFloat(x.cantidad * x.precio) / parseFloat('1.' + padLeadingZeros(x.descuento));
            imp = imp + parseFloat(x.cantidad * x.precio) / parseFloat('1.' + padLeadingZeros(x.descuento)) * parseFloat('1.' + padLeadingZeros(x.impuesto)) - parseFloat(x.cantidad * x.precio) / parseFloat('1.' + padLeadingZeros(x.descuento));
            ton = sub + imp;
        })
        setSubtotal(sub); setDescuento(desc); setImpuesto(imp); setTotaln(ton);
    };
    return (
        <>
            <Container className='mt-5 p-md-5 rounded' style={Check ? styleDay : styleDark}>
                <Form noValidate validated={validated} id='form-1' onSubmit={handleSubmit}>
                    {input === '' ? '' : (
                        <>
                            <div className='fixed-top p-2' style={carbutton}>
                                {click ? (
                                    <Button size='md' type='submit' variant="outline-dark" disabled>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        /> Save</Button>
                                ) : (
                                    <Button size='md' type='submit' variant="dark"><i className="fa-regular fa-floppy-disk"></i> Save</Button>
                                )}
                            </div>
                        </>
                    )}
                    <Form.Group as={Row} className="mb-2" controlId="formPlaintextEmail">
                        <Col sm={7}>
                            <h2 className="fw-bold">Facturación</h2>
                        </Col>
                        <Col sm={5}>
                            <h3 className="fw-light text-end">Factura No. {zerofill(number)}</h3>
                        </Col>
                    </Form.Group>
                    <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Informacion Cliente</Accordion.Header>
                            <Accordion.Body>
                                <div>
                                    <Header
                                        client={client}
                                        handleSelectChange={({ value }) => { SelectChange(value) }}
                                        click={click}
                                        direc={direc}
                                        number={number}
                                        ncf={ncf}
                                        pago={(value) => setPago(value)}
                                        nancf={nancf}
                                        rnc={rnc}
                                        input={input}
                                        detalle={(value) => setDetalle(value)}
                                        ordenc={(value) => setOrdenc(value)}
                                        vendedor={(value) => { setVendedor(value) }}
                                        diapago={(value) => { const date = new Date(); setDiapago(sumarDias(date, parseFloat(value))) }} />
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Informacion de Productos</Accordion.Header>
                            <Accordion.Body>
                                <div>
                                    {rows.map((row, index) => (
                                        <Rows
                                            {...row}
                                            onChange={(name, value) => handleOnChange(index, name, value)}
                                            onRemove={() => handleOnRemove(index)}
                                            key={index}
                                        />
                                    ))}
                                </div>
                                <Form.Group as={Col} className="mb-5 mt-3 text-end" controlId="formPlaintextEmail">
                                    <Button size='md' type='button' variant="outline-success" onClick={handleOnAdd}>
                                        <i class="fa-solid fa-plus"></i> Agregar
                                    </Button>
                                </Form.Group>
                                <div>
                                    <Footer
                                        subtotal={subtotal}
                                        tdescuento={descuento}
                                        timpuesto={impuesto}
                                        totalN={totaln}
                                    />
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Form>
            </Container>
        </>
    );
};
export const currency = (number) => {
    return new Intl.NumberFormat("en-EU", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(number);
};
export const padLeadingZeros = (num) => {
    var s = "0" + num;
    return s.substr(s.length - 2);
};
export const zerofill = (number) => {
    const a = ('0000000000' + number).slice(-10);
    return a;
};
export const sumarDias = (fecha, dias) => {
    fecha.setDate(fecha.getDate() + dias);
    var r = fecha.getFullYear() + "-" + (fecha.getMonth() + 1) + "-" + fecha.getDate()
    return r;
};
export const applyInputMask = (elementId, mask, tipo) => {
    let inputElement = document.getElementById(elementId);
    let content = '';
    let maxChars = numberCharactersPattern(mask);

    inputElement.addEventListener('keydown', function (e) {
        e.preventDefault();
        if (isNumeric(e.key) && content.length < maxChars) {
            content += e.key;
        }
        if (e.keyCode === 8) {
            if (content.length > 0) {
                content = content.substr(0, content.length - 1);
            }
        }
        if (tipo === 1) {
            inputElement.value = maskIt('B00', content);
        } else if (tipo === 2) {
            inputElement.value = maskIt('00.00', content);
        }
    })
};
const maskIt = (pattern, value) => {
    let position = 0;
    let currentChar = 0;
    let masked = '';
    while (position < pattern.length && currentChar < value.length) {
        if (pattern[position] === '0') {
            masked += value[currentChar];
            currentChar++;
        } else {
            masked += pattern[position];
        }
        position++;
    }
    return masked;
};
const isNumeric = (char) => {
    return !isNaN(char - parseInt(char));
};
const numberCharactersPattern = (pattern) => {
    let numberChars = 0;
    for (let i = 0; i < pattern.length; i++) {
        if (pattern[i] === '0') {
            numberChars++;
        }
    }
    return numberChars;
};