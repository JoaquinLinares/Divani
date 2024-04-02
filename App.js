 
import React from 'react';
import { NativeRouter, Route, Routes } from 'react-router-native';
// importo los screen
import HomeScreen from './screen/HomeScreen';
import BienesScreen from './screen/BienesScreen';
import DocumentosScreen from './screen/DocumentosScreen'
import EntradaScreen from "./screen/EntradaScreen";
import SalidaScreen from './screen/SalidaScreen'
import PedidosScreen from './screen/PedidosScreen'


const App = () => {
  return (
    
    <NativeRouter>
      <Routes>
        <Route path='/' Component={HomeScreen}/> 
        <Route path='/bienes' Component={BienesScreen}/> 
        <Route path='/documentos' Component={DocumentosScreen}/> 
        <Route path='/entrada' Component={EntradaScreen}/> 
        <Route path='/salida' Component={SalidaScreen}/> 
        <Route path='/pedidos' Component={PedidosScreen}/>        
      </Routes>
    </NativeRouter>
  );
};

export default App;
