 
import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DivaniDB from './db/divani_db.json';
import DivaniMovements from './movements/divani_movements.json';
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

const MILLI_SECONDS_PER_DAY = 1000 * 60 * 60 * 24;
const SEVEN_DAYS = 7;

const setMovements = async () => {
  const currentDate = new Date();

  const divaniMovementsUpdated = DivaniMovements
  DivaniMovements.created_at = currentDate

  const movements = await AsyncStorage.getItem("movements");
  const lastDate = movements ? JSON.parse(movements).created_at : null;

  if (lastDate && (((new Date(currentDate) - new Date(lastDate)) / MILLI_SECONDS_PER_DAY) > SEVEN_DAYS)) {
    await AsyncStorage.removeItem("movements");
    await AsyncStorage.setItem("movements", JSON.stringify(divaniMovementsUpdated))
  }
  
  if (!movements) {
    await AsyncStorage.setItem("movements", JSON.stringify(divaniMovementsUpdated))
  }
}


const setSettings = async () => {
  try {
    const database = await AsyncStorage.getItem("db")
    
    if (!database) {
      await AsyncStorage.setItem("db", JSON.stringify(DivaniDB))
    }

    await setMovements()

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
