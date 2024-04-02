import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; // Importa FontAwesome5 desde @expo/vector-icons
import Constants from 'expo-constants'; // Importa Constants desde expo-constants
import { Link } from 'react-router-native';

const NavbarScreen = ({nombre,icon}) => {
  return (
    <View style={styles.navbar}>
        <Link to={'/'}>
      <View style={styles.leftIcon}>
        {/* Icono de volver para atras */}
        <FontAwesome5 name="arrow-left" size={24} color="white" />
      </View>
      </Link>
      <Text style={styles.centerText}>{nombre}</Text>
      <View style={styles.rightIcon}>
        {/* Icono del excel-scaner */}
        <FontAwesome5 name={icon} size={24} color="white" /> 
      </View>
      <View style={styles.rightIcon}>
        {/* Icono de la barra de tres rayas */}
        <FontAwesome5 name='bars' size={24} color="white" /> 
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    marginTop: Constants.statusBarHeight, // Corrige marginTop, eliminando las comillas y el valor 'Constanst.statusBarHeight'
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgb(20, 23, 26)', // Fondo más oscuro en RGB
    paddingVertical: 20,
    paddingHorizontal: 15,    
    width: '%100',
  },
  leftIcon: {    
    marginLeft: 10,
  },
  centerText: {
    color: '#fff', // Blanco
    fontSize: 25,
    fontWeight: 'bold',
  },
  rightIcon: {
    marginRight: 2, // Ajusta el margen derecho
  },
});

export default NavbarScreen;