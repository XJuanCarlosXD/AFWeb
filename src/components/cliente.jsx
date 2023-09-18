import { Button, Form, Container, Row, Col, InputGroup } from 'react-bootstrap';
import { DarkButton, DarkInput, LightInput, styleDark, styleDay, DarkSelect } from '../Theme/themes';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select'
import Swal from 'sweetalert2'
import axios from 'axios';

const URI = 'http://localhost:8000/Client/';
const URI2 = 'http://localhost:8000/ubicacion/';
const URI3 = 'http://localhost:8000/ubicaciones/';
const URI4 = 'http://localhost:8000/Comprobantes/';

const Fcliente = ({ Check }) => {
    const option = [];
    const [validated, setValidated] = useState(false);
    const [comp, setComp] = useState([]);
    const [value, setValue] = useState(0);
    const [clients, setClient] = useState([]);
    const [show, setShow] = useState(false);
    const [nombre, setNombre] = useState(null);
    const [identificacion, setIdentificacion] = useState('');
    const [contacto, setContacto] = useState('');
    const [telefono, setTelefono] = useState('');
    const [ncf, setNcf] = useState(0);
    const [email, setEmail] = useState('');
    const [provincia, setProvincia] = useState(0);
    const [provincia1, setProvincia1] = useState([]);
    const [municipio, setMunicipio] = useState(0);
    const [municipio1, setMunicipio1] = useState([]);
    const [sector, setSector] = useState(0);
    const [sector1, setSector1] = useState([]);
    const [calle, setCalle] = useState('');
    const [activo, setActivo] = useState(false);
    const [fiar, setFiar] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        getClient();
        getProvincia();
        getSector();
        getmunicipio();
        getComprobante();
    }, []);
    const getClient = async () => {
        const res = await axios.get(URI);
        setClient(res.data);
        for (let i = 0; i < res.data.length; i++) {
            var oio = res.data[i].id + 1
        }
        setValue(oio);
    };
    const getComprobante = async () => {
        const res = await axios.get(URI4);
        setComp(res.data);
    };
    const getProvincia = async () => {
        const res = await axios.get(URI2);
        setProvincia1(res.data);
    };
    const getmunicipio = async (id) => {
        const res = await axios.get(URI2 + id);
        setMunicipio1(res.data);
    }
    const getSector = async (id) => {
        const res = await axios.get(URI3 + id);
        if (res.data.length === 0) {
            setSector1([]);
        } else {
            setSector1(res.data);
        }
    }
    const handleSelectChange = async ({ value }) => {
        const res = await axios.get(URI + value);
        setIdentificacion(res.data[0].identificacion)
        setContacto(res.data[0].contacto)
        setNombre(res.data[0].nombre)
        setTelefono(res.data[0].telefono)
        setNcf(res.data[0].ncf)
        setEmail(res.data[0].email)
        setProvincia(res.data[0].id_provincia)
        getmunicipio(res.data[0].id_provincia);
        setMunicipio(res.data[0].id_municipio);
        getSector(res.data[0].id_municipio);
        setSector(res.data[0].id_sector)
        setCalle(res.data[0].calle)
        setActivo(!!res.data[0].activo)
        setFiar(!!res.data[0].fiar)
        setValue(value)

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
                nombre: nombre,
                identificacion: identificacion,
                contacto: contacto,
                telefono: telefono,
                email: email,
                comprobanteId: ncf,
                provinciaId: provincia,
                municipioId: municipio,
                distritosMunicipaleId: sector,
                calle: calle,
                activo: activo,
                fiar: fiar
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
            const res = await axios.put(`${URI}${value}`, {
                nombre: nombre,
                identificacion: identificacion,
                contacto: contacto,
                telefono: telefono,
                email: email,
                comprobanteId: ncf,
                provinciaId: provincia,
                municipioId: municipio,
                distritosMunicipaleId: sector,
                calle: calle,
                activo: activo,
                fiar: fiar
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
    return (
        <>
            <Container className='mt-5 mb-3 p-md-5 rounded' style={Check ? styleDay : styleDark}>
                <Form noValidate validated={validated} onSubmit={show ? (handleUpdate) : (handleSubmit)}>

                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                        <Col sm={7}>
                            <h2 className="fw-bold">Clientes</h2>
                        </Col>
                        <Col sm="5">
                            <h3 className="fw-light text-end">Cliente No. 000000000{value}</h3>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className='mb-3' controlId="formPlaintextCheck">
                        <Col>
                            <Form.Check
                                type='switch'
                                id='search'
                                onClick={() => { setShow(!show) }}
                                label='Buscar Cliente'
                            />
                        </Col>
                        {show ? (
                            <>
                                {
                                    clients.forEach(client => {
                                        const optione = { label: client.nombre, value: client.id }
                                        option.push(optione)
                                    })
                                }
                                <Col>
                                    <Select
                                        defaultValue={{ label: "Selecciona Cliente", value: "empty" }}
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
                                        })}
                                    />
                                </Col>
                            </>
                        ) : ('')}
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                        <Col className='form__group field'>
                            <InputGroup hasValidation>
                                <input
                                    style={!Check ? DarkInput : LightInput}
                                    type="text"
                                    className='form__field'
                                    autoComplete='off'
                                    value={nombre}
                                    onChange={e => setNombre(e.target.value)}
                                    placeholder="Nombre Completo / Empresa"
                                    required />
                                <Form.Control.Feedback type="invalid">
                                    Por Favor Escribe un Nombre.
                                </Form.Control.Feedback>
                            </InputGroup>
                            <Form.Label className='form__label'>
                                Nombre Completo / Empresa
                            </Form.Label>
                        </Col>
                        <Col className='form__group field'>
                            <input
                                style={!Check ? DarkInput : LightInput}
                                type="text"
                                className='form__field'
                                autoComplete='off'
                                value={identificacion}
                                onChange={e => setIdentificacion(e.target.value)}
                                placeholder="000-00000-0" />
                            <Form.Label className='form__label'>
                                RNC/Cedula
                            </Form.Label>
                        </Col>
                        <Col className='form__group field'>
                            <input
                                style={!Check ? DarkInput : LightInput}
                                type="text"
                                className='form__field'
                                autoComplete='off'
                                value={contacto}
                                onChange={e => setContacto(e.target.value)}
                                placeholder="contacto" />
                            <Form.Label className='form__label'>
                                Contacto
                            </Form.Label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-5" controlId="formPlaintextEmail">
                        <Col className='form__group field'>
                            <InputGroup hasValidation>
                                <input
                                    style={!Check ? DarkInput : LightInput}
                                    type="text"
                                    className='form__field'
                                    autoComplete='off'
                                    value={telefono}
                                    onChange={e => setTelefono(e.target.value)}
                                    placeholder="(809) 000-0000" required />
                                <Form.Control.Feedback type="invalid">
                                    Por Favor Escribe un Telefono.
                                </Form.Control.Feedback>
                            </InputGroup>
                            <Form.Label className='form__label'>
                                Telefono
                            </Form.Label>
                        </Col>
                        <Col className='form__group field mt-2'>
                            <InputGroup hasValidation>
                                <select className='form__field' style={!Check ? DarkSelect : LightInput} value={ncf} onChange={e => setNcf(e.target.value)} aria-label="Default select example" required>
                                    {comp.map((x) => (
                                        <option key={x.id} value={x.id}>{x.noNcf + ' ' + x.descripcion}</option>
                                    ))}
                                </select>
                                <Form.Control.Feedback type="invalid">
                                    Por Favor Seleeciona un comprobante.
                                </Form.Control.Feedback>
                            </InputGroup>
                            <Form.Label className='form__label'>
                                NCF
                            </Form.Label>
                        </Col>
                        <Col className='form__group field'>
                            <input
                                style={!Check ? DarkInput : LightInput}
                                type="text"
                                className='form__field'
                                autoComplete='off'
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="name@example.com" />
                            <Form.Label className='form__label'>
                                Email
                            </Form.Label>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                        <Col>
                            <h2 className="fw-bold">Ubicacion</h2>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextUbicacion">
                        <Col className='form__group field'>
                            <InputGroup hasValidation>
                                <select className='form__field' style={!Check ? DarkSelect : LightInput} value={provincia} onChange={(e) => { getmunicipio(e.target.value); setProvincia(e.target.value) }} aria-label="Default select example" required>
                                    {provincia1.map((x) => (
                                        <option key={x.id} value={x.id}>{x.nombre}</option>
                                    ))}
                                </select>
                                <Form.Control.Feedback type="invalid">
                                    Por Favor Seleeciona una Provincia.
                                </Form.Control.Feedback>
                            </InputGroup>
                            <Form.Label className='form__label'>
                                Provincia
                            </Form.Label>
                        </Col>
                        <Col className='form__group field'>
                            <InputGroup hasValidation>
                                <select className='form__field' style={!Check ? DarkSelect : LightInput} value={municipio} onChange={(e) => { setMunicipio(e.target.value); getSector(e.target.value) }} onBlur={e => getSector(e.target.value)} aria-label="Default select example" required>
                                    {municipio1.map((x) => (
                                        <option key={x.id} value={x.id}>{x.nombre}</option>
                                    ))}
                                </select>
                                <Form.Control.Feedback type="invalid">
                                    Por Favor Seleeciona una Municipio.
                                </Form.Control.Feedback>
                            </InputGroup>
                            <Form.Label className='form__label'>
                                Municipio
                            </Form.Label>
                        </Col>
                        {sector1.length === 0 ? ('') : (
                            <>
                                <Col className='form__group field'>
                                    <select className='form__field' style={!Check ? DarkSelect : LightInput} value={sector} onChange={e => setSector(e.target.value)} aria-label="Default select example">
                                        {sector1.map((x) => (
                                            <option key={x.id} value={x.id}>{x.nombre}</option>
                                        ))}
                                    </select>
                                    <Form.Label className='form__label'>
                                        Sector
                                    </Form.Label>
                                </Col>
                            </>)}
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextUbicacion">
                        <Col className='form__group field'>
                            <input
                                style={!Check ? DarkInput : LightInput}
                                type="text"
                                className='form__field'
                                autoComplete='off'
                                value={calle}
                                onChange={e => setCalle(e.target.value)}
                                placeholder='Calle' required />
                            <Form.Label className='form__label'>
                                Calle
                            </Form.Label>
                        </Col>
                        <Col className='mt-4' sm={2}>
                            <Form.Check
                                type='switch'
                                id="active"
                                value={activo}
                                checked={activo}
                                onClick={e => setActivo(e.target.checked)}
                                label="Activo"
                                required />
                        </Col>
                        <Col className='mt-4' sm={2}>
                            <Form.Check
                                type='switch'
                                id="fiar"
                                value={fiar}
                                checked={fiar}
                                onClick={e => setFiar(e.target.checked)}
                                label="Permite Fiar" />
                        </Col>
                        <Col className='mt-4 text-end'>
                            {show ? (
                                <Button size='md' style={Check ? DarkButton : {}} type='submit' variant="light"><i className="fa-regular fa-floppy-disk"></i> Update</Button>
                            ) : (
                                <Button size='md' style={Check ? DarkButton : {}} type='submit' variant="light"><i className="fa-regular fa-floppy-disk"></i> Save</Button>
                            )}

                        </Col>
                    </Form.Group>
                </Form>
            </Container >
        </>
    )
};

export default Fcliente;