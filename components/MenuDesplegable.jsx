import React from 'react';
import { Text, View, TouchableOpacity, Animated, StyleSheet } from 'react-native';
// import { BackHandler } from 'react-native';
import Constants from 'expo-constants'; // Importa Constants desde expo-constants
import { Link } from 'react-router-native';

const MenuDesplegable = ({ menuAnimation, toggleMenu, nombre}) => {

  // useEffect(() => {
  //   const backAction = () => {
  //     if (menuAnimation._value === 0) {
  //       toggleMenu();
  //       return true; // Indica que el evento fue manejado
  //     }
  //     return false; // Indica que el evento no fue manejado
  //   };

  //   // Agrega el listener para el botón de "Atrás"
  //   const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

  //   // Elimina el listener cuando el componente se desmonta
  //   return () => backHandler.remove();
  // }, [menuAnimation]);
  
  return (
    <Animated.View style={[styles.menu, { transform: [{ translateX: menuAnimation }] }]}>
      <TouchableOpacity onPress={toggleMenu}>
        <Link to={'/'}>
          <Text style={styles.menuItem}>Home</Text>
        </Link> 
      </TouchableOpacity>       

      {nombre != 'bienes' ? <TouchableOpacity onPress={toggleMenu}>
        <Link to={'/bienes'}>
          <Text style={styles.menuItem}>Bienes</Text>
        </Link>
      </TouchableOpacity> : <Text style={{position:'absolute'}}></Text>}

      {nombre != 'documentos' ? <TouchableOpacity onPress={toggleMenu}>
        <Link to={'/documentos'}>
          <Text style={styles.menuItem}>Documentos</Text>
        </Link>
      </TouchableOpacity> : <Text style={{position:'absolute'}}></Text>}
      

      {nombre != 'entrada' ? <TouchableOpacity onPress={toggleMenu}>
        <Link to={'/entrada'}>
          <Text style={styles.menuItem}>Entrada</Text>
        </Link>
      </TouchableOpacity> : <Text style={{position:'absolute'}}></Text>}

      {nombre != 'salida' ? <TouchableOpacity onPress={toggleMenu}>
        <Link to={'/salida'}>
          <Text style={styles.menuItem}>Salida</Text>
        </Link>
      </TouchableOpacity> : <Text style={{position:'absolute'}}></Text>}

      {nombre != 'pedidos' ? <TouchableOpacity onPress={toggleMenu}>
        <Link to={'/pedidos'}>
          <Text style={styles.menuItemUlt}>Pedidos</Text>
        </Link>
      </TouchableOpacity> : <Text style={{position:'absolute'}}></Text>}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    backgroundColor: '#6A6A11',
    top: Constants.statusBarHeight + 60,
    right: -250, 
    width: 250,
    height: 345,
    paddingTop: 22,
    paddingRight: 20, 
    zIndex:999,
  },
  menuItem: {
    color: 'white',    
    fontSize: 22,
    marginTop: 10,
    marginBottom: 15,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    paddingLeft:5,
    marginLeft:5,
    
  },
  menuItemUlt: {
    color: 'white',    
    fontSize: 22,
    marginTop: 8,    
    paddingLeft:5,
    marginLeft:5,
    
  },
});

export default MenuDesplegable;

