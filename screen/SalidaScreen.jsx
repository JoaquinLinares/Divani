import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Button, TouchableWithoutFeedback, Alert } from 'react-native'; 
import { BackHandler } from 'react-native'; // Importa BackHandler para manejar el evento de retroceso del dispositivo
import { useNavigate } from 'react-router-native'; 
import { Camera } from 'expo-camera'; 
import { FontAwesome5 } from '@expo/vector-icons'; 
import Constants from 'expo-constants'; 
import { Link } from 'react-router-native'; 
import styles from '../styles'; 


const SalidaScreen = () => {
  // Definición de variables de estado y constantes
  const nombre = 'Salida'; // Nombre de la pantalla
  const icon = 'barcode'; // Icono para abrir la cámara

  const [hasPermission, setHasPermission] = useState(null); // Estado para controlar si se otorgaron permisos para acceder a la cámara
  const [scannedData, setScannedData] = useState(null); // Estado para almacenar los datos escaneados
  const history = useNavigate(); // Función de navegación
  const [openCamera, setOpenCamera] = useState(false); // Estado para controlar si la cámara está abierta
  const [showNavBar, setShowNavBar] = useState(true); // Estado para controlar la visibilidad del NavBar

  // Función para solicitar permisos y abrir la cámara al presionar el icono del scanner
  const handleCameraPress = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync(); // Solicita permisos para acceder a la cámara
    if (status === 'granted') {
      setOpenCamera(true); // Abre la cámara si se otorgan los permisos
      setShowNavBar(false); // Oculta el NavBar cuando se abre la cámara
    } else {
      Alert.alert('Se requieren permisos', 'Por favor, activa los permisos de la cámara.'); // Muestra una alerta si no se otorgan los permisos
    }
  };

  // Función para manejar el evento de retroceso del dispositivo
  const handleBackPress = () => {
    if (openCamera) {
      setOpenCamera(false); // Cierra la cámara si está abierta
      setShowNavBar(true); // Muestra el NavBar cuando se cierra la cámara
      return true; // Evita que la aplicación se cierre al presionar el botón de retroceso
    } else {
      history('/'); // Navega de vuelta a la pantalla de inicio (HomeScreen)
      return true; // Evita que la aplicación se cierre al presionar el botón de retroceso
    }
  };

  // Efecto para manejar el evento de retroceso del dispositivo
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress); // Registra el evento de retroceso del dispositivo

    return () => backHandler.remove(); // Limpia el evento de retroceso al desmontar el componente
  }, [openCamera]); // Ejecuta el efecto cuando cambia el estado de openCamera

  // Efecto para solicitar permisos al abrir la cámara
  useEffect(() => {
    const requestCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync(); // Solicita permisos para acceder a la cámara
      setHasPermission(status === 'granted'); // Actualiza el estado de los permisos
    };

    if (openCamera) {
      requestCameraPermission(); // Solicita permisos al abrir la cámara
    }
  }, [openCamera]); // Ejecuta el efecto cuando cambia el estado de openCamera

  // Función para manejar el escaneo de códigos de barras
  const handleBarCodeScanned = ({ type, data }) => {
    setScannedData({ type, data }); // Almacena los datos escaneados
  };

  // Renderización del componente
  return (
    <View style={styles.mainContainer}>
      {/* NavBar de salida */}
      {showNavBar && (
        <View style={stylesSalida.navbar}>
          <View style={stylesSalida.leftIcon}>
            {/* Icono de volver para atrás */}
            <Link to={'/'}>
              <FontAwesome5 name="arrow-left" size={24} color="white" />
            </Link>
          </View>
          <Text style={stylesSalida.centerText}>{nombre}</Text>
          <View style={stylesSalida.rightIcon}>
            {/* Icono del scanner */}
            <TouchableWithoutFeedback onPress={handleCameraPress}>
              <FontAwesome5 name={icon} size={24} color="white" /> 
            </TouchableWithoutFeedback>
          </View>
          <View style={stylesSalida.rightIcon}>
            {/* Icono de la barra de tres rayas */}
            <FontAwesome5 name='bars' size={24} color="white" /> 
          </View>
        </View>
      )}
      
      {/* Renderiza la cámara si está abierta */}
      {openCamera && (
        <View style={{ flex: 1 }}>
          <Camera
            onBarCodeScanned={scannedData ? undefined : handleBarCodeScanned}
            style={{ flex: 1 }}
          />
          <TouchableWithoutFeedback onPress={handleBackPress}>
            <View style={styles.closeIcon}>
              <FontAwesome5 name="times" size={24} color="white" /> 
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.scanRect} />
          {scannedData && (
            <View style={styles.scannedDataContainer}>
              <Text style={styles.scannedData}>
                {`Tipo de código de barras: ${scannedData.type}\nDatos: ${scannedData.data}`}
              </Text>
              <Button
                title="Escanear de nuevo"
                onPress={() => setScannedData(null)}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

// Estilos del NavBar
const stylesSalida = StyleSheet.create({
  navbar: {
    marginTop: Constants.statusBarHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgb(20, 23, 26)',
    paddingVertical: 20,
    paddingHorizontal: 15,    
    width: '100%',
  },
  leftIcon: {    
    marginLeft: 10,
  },
  centerText: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
  },
  rightIcon: {
    marginRight: 2,
  },
});

export default SalidaScreen; 
