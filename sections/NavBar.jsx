import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, BackHandler } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; // Importa FontAwesome5 desde @expo/vector-icons
import Constants from 'expo-constants'; // Importa Constants desde expo-constants
import { Link } from 'react-router-native';
import { Platform,StatusBar } from 'react-native';

const Navbar = () => {
  const menuAnimation = new Animated.Value(-260); // Valor inicial fuera de la pantalla
  
  const toggleMenu = () => {
    const toValue = menuAnimation._value === -260 ? 0 : -260; // Determina el nuevo valor de la animación
    Animated.spring(menuAnimation, {
      toValue,
      useNativeDriver: false, // Necesario para que funcione en Android
    }).start();
  };

  useEffect(() => {
    const backAction = () => {
      if (menuAnimation._value === 0) {
        toggleMenu();
        return true; // Indica que el evento fue manejado
      }
      return false; // Indica que el evento no fue manejado
    };

    // Agrega el listener para el botón de "Atrás"
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    // Elimina el listener cuando el componente se desmonta
    return () => backHandler.remove();
  }, [menuAnimation]);

  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={toggleMenu} style={styles.leftIcon}>
        {/* Icono de tres rayas */}
        <FontAwesome5 name="bars" size={32} color="white" />
      </TouchableOpacity>
      <Text style={styles.centerText}>Divani</Text>
      <View style={styles.rightIcon}>
        {/* Icono de un zapato */}
        <FontAwesome5 name="shoe-prints" size={28} color="white" /> 
      </View>

      {/* Menú desplegable */}
      <Animated.View style={[styles.menu, { transform: [{ translateX: menuAnimation }] }]}>
        <TouchableOpacity onPress={toggleMenu}>
          <Link to={'/bienes'}>
            <Text style={styles.menuItem}>Bienes</Text>
          </Link> 
        </TouchableOpacity>       

        <TouchableOpacity onPress={toggleMenu}>
          <Link to={'/documentos'}>
            <Text style={styles.menuItem}>Documentos</Text>
          </Link>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleMenu}>
          <Link to={'/entrada'}>
            <Text style={styles.menuItem}>Entrada</Text>
          </Link>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleMenu}>
          <Link to={'/salida'}>
            <Text style={styles.menuItem}>Salida</Text>
          </Link>
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleMenu}>
          <Link to={'/pedidos'}>
            <Text style={styles.menuItemUlt}>Pedidos</Text>
          </Link>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};


const styles = StyleSheet.create({
  navbar: {
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
    width: '100%',
    zIndex:500
    
  },
  leftIcon: {
    marginLeft: 10,
  },
  centerText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  rightIcon: {
    marginRight: 10,
  },
  menu: {
    position: 'absolute',
    backgroundColor: '#6A6A11',
    top: Constants.statusBarHeight + 50,
    left: 0,
    width: 250,
    height:350,
    paddingTop: 20,
    paddingLeft: 20,
    borderRadius:5,
    zIndex:999,
  },
  menuItem: {
    color: 'white',    
    fontSize: 22,
    marginTop:10,
    marginBottom: 15,
    paddingBottom:5,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    zIndex:999,
  },
  menuItemUlt: {
    color: 'white',    
    fontSize: 22,
    marginTop:10,
    marginBottom: 15,
    paddingBottom:5,
    zIndex:500
  },
});

export default Navbar;
