 
import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DivaniDB from './db/divani_db.json'
import { NativeRouter, Route, Routes } from 'react-router-native';
import { ContextAppProvider } from './components/ContextApp'; // Ajusta la ruta si es diferente
// importo los screen
import HomeScreen from './screen/HomeScreen';
import BienesScreen from './screen/BienesScreen';
import DocumentosScreen from './screen/DocumentosScreen'
import EntradaScreen from "./screen/EntradaScreen";
import SalidaScreen from './screen/SalidaScreen'
import PedidosScreen from './screen/PedidosScreen'
import StockScreen from './screen/StockScreen';


const setSettings = async () => {
  try {
    const isInit = await AsyncStorage.getItem("init")
    
    if (!isInit) {
      await AsyncStorage.setItem("init", JSON.stringify(true))
      await AsyncStorage.setItem("db", JSON.stringify(DivaniDB))
    }
  } catch (error) {
    console.error(error)
  }
}

const App = () => {
  
  useEffect(() => {
    setSettings()    
  }, [])
  return (
    <ContextAppProvider>
    <NativeRouter>
      <Routes>
        <Route path='/' Component={HomeScreen}/> 
        <Route path='/bienes' Component={BienesScreen}/> 
        <Route path='/documentos' Component={DocumentosScreen}/> 
        <Route path='/entrada' Component={EntradaScreen}/> 
        <Route path='/salida' Component={SalidaScreen}/> 
        <Route path='/pedidos' Component={PedidosScreen}/>        
        <Route path='/stock/:article' Component={StockScreen}/>        
      </Routes>
    </NativeRouter>
    </ContextAppProvider>
  );
};

export default App;
