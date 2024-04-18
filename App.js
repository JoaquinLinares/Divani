 
import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DivaniDB from './db/divani_db.json'
import { NativeRouter, Route, Routes } from 'react-router-native';
// importo los screen
import HomeScreen from './screen/HomeScreen';
import BienesScreen from './screen/BienesScreen';
import DocumentosScreen from './screen/DocumentosScreen'
import EntradaScreen from "./screen/EntradaScreen";
import SalidaScreen from './screen/SalidaScreen'
import PedidosScreen from './screen/PedidosScreen'

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
