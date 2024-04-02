import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width; // Ancho de la ventana
const windowHeight = Dimensions.get('window').height; // Alto de la ventana
const maxSquareWidth = 160; // Ancho máximo del cuadrado en píxeles

const SectionSquare = ({ logo, title, count }) => {
  // Calcula el ancho y alto del cuadrado basado en el ancho de la ventana y el ancho máximo permitido
  const squareSize = Math.min(windowWidth * 0.4, maxSquareWidth);
  return (
    <View style={[styles.container, { width: squareSize, height: squareSize }]}>
      <View style={styles.content}>
        <Text style={styles.text}>{logo}</Text>
        <Text style={styles.text}>{title}</Text>
        {count && <Text style={styles.text}>{count}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#757575', // Gris más oscuro
    borderColor: '#006400', // Verde más oscuro
    borderWidth: 2,
    borderRadius: 10,
    overflow: 'hidden',
    margin: windowWidth * 0.05, // Utiliza el 5% del ancho de la ventana como margen
    margin: windowHeight * 0.01, // Utiliza el 1% del ancho de la ventana como margen
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    margin: 2,
    color: '#ffffff', // Blanco
    fontSize: 18,
  },
});

export default SectionSquare;
