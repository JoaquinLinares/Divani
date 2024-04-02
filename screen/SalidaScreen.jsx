import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import NavbarScreen from '../components/NavBarScreen';
import { BackHandler } from 'react-native';
import { useNavigate } from 'react-router-native';

import styles from '../styles';


const SalidaScreen = () => {
  const nombre = 'Salida'
  const icon = 'barcode'
  
    const history = useNavigate();
  
    useEffect(() => {
      const backAction = () => {
        history('/'); // Navega de vuelta a la pantalla de inicio (HomeScreen)
        return true; // Evita que la aplicación se cierre al presionar el botón de retroceso
      };
  
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
  
      return () => backHandler.remove();
    }, [history]);
  

  return (
    <View style={styles.mainContainer}>
      <NavbarScreen nombre={nombre} icon={icon} />
    <Text  style={{color:'#fff',}}>Entrada</Text>

    </View>
    
  );
};

export default SalidaScreen;