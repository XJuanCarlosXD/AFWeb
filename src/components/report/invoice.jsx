import { Button, Container } from 'react-bootstrap';
import { useRef } from 'react';
import ReactToPrint from 'react-to-print';
import { SelectFac } from './component';
import { ComponentToPrint } from './component';
import { useState } from 'react';

const Invoce = () => {
    const [data, setData] = useState([]);
    const [rows, setRows] = useState([]);
    const componentRef = useRef();
    const carbutton = {
        opacity: data.length === 0 ? 0 : 1,
        transition: "all 1s ease-in"
    };
    return (
        <>
            <SelectFac
                onChange={(value) => setData(value)}
                Rows={(value) => setRows(value)} />
            <div>
                <ReactToPrint
                    trigger={() => <Container style={carbutton} className="text-end mb-2"><Button type="button" size='md' className="btn btn-dark">
                        <i className="fa fa-print"></i> Print</Button></Container>}
                    content={() => componentRef.current}
                />
                <div style={carbutton}>
                    {data.length === 0 ? '' : (
                        <ComponentToPrint
                            ref={componentRef}
                            client={data.nombre}
                            rnc={data.identificacion}
                            address={!data.provincia.nombre === data.municipio.nombre ? (data.provincia.nombre + ' ' + data.municipio.nombre + ' ' + data.calle) : (data.provincia.nombre + ' ' + data.calle)}
                            email={data.email}
                            phone={data.telefono}
                            pago={data.detalle_facturas[0].formaPago}
                            vendedor={data.detalle_facturas[0].vendedor}
                            nofactura={data.detalle_facturas[0].id}
                            nocomprobante={data.detalle_facturas[0].noNcf}
                            ncf={data.length === 0 ? '' : data.detalle_facturas[0].comprobante}
                            nameNcf={data.length === 0 ? 'Nombre de Comprobante' : (data.comprobante.descripcion)}
                            datev={data.comprobante.dateV}
                            date={data.detalle_facturas[0].createdAt}
                            rows={rows} />
                    )}
                </div>
            </div>
        </>
    );
};

export default Invoce;