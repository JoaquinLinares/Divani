import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableWithoutFeedback, Image, ScrollView, useWindowDimensions, TouchableOpacity,Animated } from 'react-native';
import { BackHandler } from 'react-native';
import { useNavigate } from 'react-router-native';
import { Camera } from 'expo-camera';
import { FontAwesome5 } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { Link } from 'react-router-native';
import styles  from '../styles';
import imageSource from '../assets/Box-Transparent-PNG.webp'; 
import MenuDesplegable from '../components/MenuDesplegable';

const EntradaScreen = () => {
  // Definición de variables de estado y constantes
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedData, setScannedData] = useState([]);
  const [scanMessage, setScanMessage] = useState("");
  const [openCamera, setOpenCamera] = useState(false);
  const [isScanning, setIsScanning] = useState(false); // Nuevo estado para controlar el escaneo
  const [flashOn, setFlashOn] = useState(false); // Nuevo estado para controlar el flash
  const history = useNavigate(); // Función de navegación
  const window = useWindowDimensions(); // Dimensiones de la ventana

  // Función para manejar el evento de retroceso del dispositivo
  const handleBackPress = () => {
    if (openCamera) {
      setOpenCamera(false); // Cierra la cámara si está abierta
      return true; // Evita que la aplicación se cierre al presionar el botón de retroceso
    } else {
      setScannedData([]); // Reinicia los datos escaneados al volver al home
      history('/'); // Navega de vuelta a la pantalla de inicio (HomeScreen)
      return true; // Evita que la aplicación se cierre al presionar el botón de retroceso
    }
  };

  // Efecto para manejar el evento de retroceso del dispositivo
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress); // Registra el evento de retroceso del dispositivo

    return () => backHandler.remove(); // Limpia el evento de retroceso al desmontar el componente
  }, [openCamera]); // Ejecuta el efecto cuando cambia el estado de openCamera

  // Función para manejar el escaneo de códigos de barras
  const handleBarCodeScanned = ({ type, data }) => {
    if (!isScanning) {
      setIsScanning(true); // Inicia el escaneo
      setScanMessage(` Datos - ${data}`);
      
      // Verifica si el producto ya ha sido escaneado antes
      const existingProductIndex = scannedData.findIndex(item => item.data === data);
      if (existingProductIndex !== -1) {
        // Si el producto ya ha sido escaneado, incrementa el contador
        const updatedScannedData = [...scannedData];
        updatedScannedData[existingProductIndex].count += 1;
        setScannedData(updatedScannedData);
      } else {
        // Si es un nuevo producto, agrega un nuevo elemento a la lista
        setScannedData(prevData => [...prevData, { type, data, count: 1 }]);
      }
  
      // Después de 2.5 segundos, habilita nuevamente el escaneo
      setTimeout(() => {        
        setIsScanning(false);
      }, 2500);

      setTimeout(() => {
        setScanMessage("");        
      }, 2100);
    }
  };

  // Función para alternar el estado del flash
  const toggleFlash = () => {
    setFlashOn(!flashOn);
  };

  // Menu desplegable
  const menuAnimation = new Animated.Value(0); // Valor inicial fuera de la pantalla

  const toggleMenu = () => {
    const toValue = menuAnimation._value === -250 ? 0 : -250; // Determina el nuevo valor de la animación
    Animated.spring(menuAnimation, {
      toValue,
      useNativeDriver: false, // Necesario para que funcione en Android
    }).start();
  };

  // Renderización del componente
  return (
    <View style={styles.mainContainer}>
      {/* NavBar de Entrada */}
      {!openCamera && (
        <View style={[styles.navbar, { marginTop: Constants.statusBarHeight }]}>
          <View style={styles.leftIcon}>
            {/* Icono de volver para atrás */}
            <Link to={'/'}>
              <FontAwesome5 name="arrow-left" size={24} color="white" />
            </Link>
          </View>
          <Text style={styles.centerText}>Entrada</Text>
          <View style={styles.rightIcon}>
            {/* Icono del scanner */}
            <TouchableWithoutFeedback onPress={() => setOpenCamera(true)}>
              <FontAwesome5 name="barcode" size={24} color="white" /> 
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.rightIcon}>
            {/* Icono de la barra de tres rayas */}
            <TouchableOpacity onPress={toggleMenu}>
              <FontAwesome5 name='bars' size={24} color="white" />
            </TouchableOpacity>
          </View>
          
        </View>
      )}

      {/* Contenido de la sección */}
      {!openCamera && (
        <View style={styles.sectionContainer}>
        
          {scannedData.length > 0 ? ( // Renderiza los datos escaneados si hay algún elemento
          <><View>
              <Text style={stylesBienes.text}>Articulos escaneados <FontAwesome5 name='arrow-down' size={20} color='white' /></Text>
            </View><ScrollView style={[stylesBienes.scrollView, { maxHeight: window.height - Constants.statusBarHeight - 220 }]}>
                {scannedData.map((item, index) => (
                  <View key={index} style={stylesBienes.scannedItem}>
                    <Text style={stylesBienes.scannedDataText}>
                      {item.data}
                    </Text>
                    <Text style={stylesBienes.scannedCountText}>
                      {item.count}
                    </Text>
                  </View>
                ))}
              </ScrollView></>
          ) : (
            // Esto se muestra cuadno no hay productos escaneados
            <View style={stylesIMG.imageContainer}>
              <Image source={imageSource} style={stylesIMG.image} />
              <Text style={stylesIMG.largeText}>Agregar sus artículos</Text>
            </View>
          )}
        </View>
      )}
       <MenuDesplegable menuAnimation={menuAnimation} toggleMenu={toggleMenu} nombre='entrada' />


      {/* Renderiza la cámara si está abierta */}
      {openCamera && (
        <View style={styles.cameraContainer}>
          <Camera
            onBarCodeScanned={handleBarCodeScanned}
            style={StyleSheet.absoluteFill}
            flashMode={flashOn ? 'torch' : 'off'} // Configura el modo de flash
          />
          {/* Mensaje de escaneo */}
          {scanMessage !== "" && (
            <View style={styles.scanRectContainer}>
              <Text style={styles.text}>{scanMessage}</Text>
            </View>
          )}
          {/* Botón para alternar el flash */}
          <TouchableWithoutFeedback onPress={toggleFlash}>
            <View style={styles.flashButton}>
            <FontAwesome5 name={flashOn ? "bolt" : "bolt"} size={24} color={flashOn ? "#FFF" : "rgba(255, 255, 255, 0.5)"} /> 
            </View>
          </TouchableWithoutFeedback>
          {/* Botón para cerrar la cámara */}
          <TouchableWithoutFeedback onPress={handleBackPress}>
            <View style={styles.closeIcon}>
              <FontAwesome5 name="times" size={24} color="white" /> 
            </View>
          </TouchableWithoutFeedback>
          {/* Rectángulo de escaneo */}
          <View style={styles.scanRect} />
        </View>
      )}
    </View>
  );
};

// Estilos del NavBar
const stylesBienes = StyleSheet.create({  
  // contenido de lo escaneado
  scannedItem: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width:'80%',
    height:85,
    alignSelf:'center',
    backgroundColor: '#555',
    padding: 10,
    borderRadius: 5,
  },
  scannedDataText: {
    color:'#fff',
    fontSize: 18,
  },
  scannedCountText: {
    color:'#fff',
    fontSize: 18,
  },
  scrollView: {
    // marginBottom: 20,
    marginTop:10,
  },
  // Contenedor del texto del contendio
  text:{
    color:'#fff',
    fontSize:20,    
    textAlign:'center',
    marginTop:20,
    marginBottom:20,
  }
});

// Estilos adicionales para la imagen y el texto
const stylesIMG = StyleSheet.create({
  imageContainer: {
    marginTop: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    opacity: 0.6, 
  },
  largeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#AAA',
    
  },
});

export default EntradaScreen;
