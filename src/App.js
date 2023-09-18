import { Form } from 'react-bootstrap';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Consurt from './components/consulta';
//import Report from './components/report';
import { useState } from 'react';
import Fcliente from './components/cliente';
import Fcomprobante from './components/comprobante';
import { TableFact } from './components/facturacion/component';
import Home from './components/home';
import EntradaP from './components/product/entrada';
import Product from './components/product/product';
import Invoce from './components/report/invoice';
import './float.css';
import NavbarExample from './layouts/navbar';
import NavProduct from './layouts/navProduct';
import { styleDark, styleDay } from './Theme/themes';

function App() {
  const [theme, setTheme] = useState(false);
  return (
    <>
      <div className="App" style={theme ? styleDark : styleDay}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<NavbarExample />}>
              <Route index element={<Home />} />
              <Route path='/Facturacion' element={<TableFact Check={theme} />} />
              <Route path='/Product' element={<Product Check={theme} />} />
              <Route path='/Cliente' element={<Fcliente Check={theme} />} />
              <Route path='/consulta' element={<Consurt />} />
              <Route path='/PrintFact' element={<Invoce />} />
              <Route path='/Comprobantes' element={<Fcomprobante Check={theme} />} />

              <Route path='*' element={<Navigate replace to="/" />} />
            </Route>
            <Route path='/Product' element={<NavProduct />}>
              <Route index element={<Product Check={theme} />} />
              <Route path='/Product/Entradas' element={<EntradaP Check={theme} />} />

            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-center"
          reverseOrder={false}
        />
      </div>
      <div id="floating-button">
        <Form.Check
          type="checkbox"
          label='night'
          id='time'
          value={theme}
          onChange={() => { setTheme(!theme) }} />
      </div>
    </>
  );
}

export default App;
