import React, { useEffect } from 'react';
import { Text, View,Animated,TouchableOpacity } from 'react-native';
import { BackHandler } from 'react-native';
import { useNavigate } from 'react-router-native';
import Constants from 'expo-constants';
import { Link } from 'react-router-native';
import { FontAwesome5 } from '@expo/vector-icons';
import MenuDesplegable from '../components/MenuDesplegable';
import styles from '../styles';
import { addAllItems, deleteAllItems } from '../services/async-storage-write';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllItems } from '../services/async-storage-read';

const PedidosScreen = () => {

    const history = useNavigate();
  
    useEffect(() => {
      const backAction = () => {
        history('/'); // Navega de vuelta a la pantalla de inicio (HomeScreen)
        return true; // Evita que la aplicación se cierre al presionar el botón de retroceso
      };
  
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
  
      return () => backHandler.remove();
    }, [history]);

    // Menu desplegable
    const menuAnimation = new Animated.Value(0); // Valor inicial fuera de la pantalla

    const toggleMenu = () => {
      const toValue = menuAnimation._value === -250 ? 0 : -250; // Determina el nuevo valor de la animación
      Animated.spring(menuAnimation, {
        toValue,
        useNativeDriver: false, // Necesario para que funcione en Android
      }).start();
    };


    /////////////////////////////////////////////////////////////////// Simulación de uso de deleteAllItems
// const simulateDeleteAllItems = async () => {
//   try {
//       console.log("Elementos antes de eliminar:", await AsyncStorage.getItem('db'));

//       console.log("Eliminando todos los elementos...");
//       await deleteAllItems();
//       console.log("Elementos después de eliminar:", await AsyncStorage.getItem('db'));
//   } catch (error) {
//       console.error("Error en la simulación:", error);
//   }
// };

// const simulateAddAllItems = async () => {
//     try {
//         console.log("Elementos antes de agregar:", await AsyncStorage.getItem('db'));
  
//         console.log("Agregando todos los elementos...");
//         await addAllItems();
//         console.log("Elementos después de agregar:", await AsyncStorage.getItem('db'));
//     } catch (error) {
//         console.error("Error en la simulación:", error);
//     }
//   };
//   // Ejecutar la simulación
//   simulateAddAllItems();


// useEffect(() => {
//       const fetchData = async () => {
//           const items = await getAllItems();
//           console.log("Datos leídos desde AsyncStorage:", items);
//       };

//       fetchData();
//   }, []);  
  

  return (
    <View style={styles.mainContainer}>
      {/* NavBar de Pedidos */}
       <View style={[styles.navbar, { marginTop: Constants.statusBarHeight }]}>
          <View style={styles.leftIcon}>
            {/* Icono de volver para atrás */}
            <Link to={'/'}>
              <FontAwesome5 name="arrow-left" size={24} color="white" />
            </Link>
          </View>
          <Text style={styles.centerText}>Pedidos</Text>
          <View style={styles.rightIcon}>
            {/* Icono del Excel */}            
              <FontAwesome5 name="file-excel" size={24} color="white" />             
          </View>
          <View style={styles.rightIcon}>
            {/* Icono de la barra de tres rayas */}
            <TouchableOpacity onPress={toggleMenu}>
              <FontAwesome5 name='bars' size={24} color="white" />
            </TouchableOpacity>
          </View>          
        </View>
        {/*       */}
        <MenuDesplegable menuAnimation={menuAnimation} toggleMenu={toggleMenu} nombre='pedidos' />

    </View>
    
  );  
}

export default PedidosScreen;