import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import { Link } from 'react-router-native';
import styles from '../styles';

// Importa los componentes de HomeScreen
import BienesSection from '../sections/BienesSection';
import DocumentosSection from '../sections/DocumentosSection';
import EntradaSection from '../sections/EntradaSection';
import SalidaSection from '../sections/SalidaSection';
import PedidosSection from '../sections/PedidosSection';
import ModoSection from '../sections/ModoSection';
import NavBar from '../sections/NavBar';

const HomeScreen = () => {
  return (
    <ImageBackground source={require('../assets/Musica.png')} style={styles.backgroundImage}>
      <View style={styles.mainContainerHome}>
        {/* NavBar */}
        <NavBar />
        <Text style={style.text}> Menu principal </Text>
        <View style={styles.sectionContainer}>
          <View style={styles.row}>
            <Link to={'/bienes'}>
              <View>
                <BienesSection />
              </View>
            </Link>
            <Link to={'/documentos'}>
              <View>
                <DocumentosSection />
              </View>
            </Link>
          </View>
          <View style={styles.row}>
            <Link to={'/entrada'}>
              <View>
                <EntradaSection />
              </View>
            </Link>
            <Link to={'/salida'}>
              <View>
                <SalidaSection />
              </View>
            </Link>
          </View>
          <View style={styles.row}>
            <Link to={'/pedidos'}>
              <View>
                <PedidosSection />
              </View>
            </Link>
            <TouchableWithoutFeedback>
              <View>
                <ModoSection />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const style = StyleSheet.create({
  text: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 0,
    paddingTop:10,    
    padding: 5,
    fontSize: 15,      
    backgroundColor: 'rgba(26, 47, 20, 0.1)', // Color de fondo con opacidad
  },
});

export default HomeScreen;
