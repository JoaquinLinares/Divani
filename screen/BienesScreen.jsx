import React, { useEffect } from 'react';
import { Text, View,Animated,TouchableOpacity } from 'react-native';
import { BackHandler } from 'react-native';
import { useNavigate } from 'react-router-native';
import Constants from 'expo-constants';
import { Link } from 'react-router-native';
import { FontAwesome5 } from '@expo/vector-icons';
import MenuDesplegable from '../components/MenuDesplegable';
import styles from '../styles';

import { getAllItems } from '../services/async-storage-read'; // Importa el método de lectura
// import { updateItem,addItem,deleteItemById } from '../services/async-storage-write';

const BienesScreen = () => {

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

    ////////////////////////////////////////////////////////////// Simulación de llamada al método de escritura
     
  //    useEffect(() => {
  //     const addNewItem = async () => {
  //         const newItem = {
  //             id: 105,
  //             articulo: 450,
  //             color: "negro",
  //             talle: 38,
  //             stock: 9
  //         };
  //         await addItem(newItem);
  //         console.log("Nuevo artículo agregado:", newItem);
  //     };

  //     addNewItem();
  // }, []);


  /////////////////////////////////////////////////////////////////// Simulacion metodo de eliminar
//   useEffect(() => {
//     const fetchDataDelete = async () => {
//         const items = await deleteItemById(105);
//         console.log("Dato eliminado:", items);
//     };

//     fetchDataDelete();
// }, []);


//////////////////////////////////////////////////////////////////Simulación de llamada al método de actualización
// useEffect(() => {
//   const updateExistingItem = async () => {
//       const updatedItem = {
//           id: 2,
//           articulo: 1120,
//           color: "bordo",
//           talle: 36,
//           stock: 25
//       };
//       await updateItem(updatedItem);
//       console.log("Artículo actualizado:", updatedItem);
//   };

//   updateExistingItem();
// }, []);


     //////////////////////////////////////////////////////////////////Simulación de llamada al método de lectura
     useEffect(() => {
      const fetchData = async () => {
          const items = await getAllItems();
          console.log("Datos leídos desde AsyncStorage:", items);
      };

      fetchData();
  }, []);  

  return (
    <View style={styles.mainContainer}>
      {/* NavBar de Bienes */}
       <View style={[styles.navbar, { marginTop: Constants.statusBarHeight }]}>
          <View style={styles.leftIcon}>
            {/* Icono de volver para atrás */}
            <Link to={'/'}>
              <FontAwesome5 name="arrow-left" size={24} color="white" />
            </Link>
          </View>
          <Text style={styles.centerText}>Bienes</Text>
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
        <MenuDesplegable menuAnimation={menuAnimation} toggleMenu={toggleMenu} nombre='bienes' />

    </View>
    
  );  
}

export default BienesScreen;