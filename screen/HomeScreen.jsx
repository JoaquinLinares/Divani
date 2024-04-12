import React from 'react';
import { View, Text, StyleSheet,TouchableWithoutFeedback } from 'react-native';
import styles from '../styles';
import { Link } from 'react-router-native';
import 'react-native-gesture-handler';

// Importa los componentes de HomeScreen

import BienesSection from '../sections/BienesSection';
import DocumentosSection from '../sections/DocumentosSection';
import EntradaSection from '../sections/EntradaSection';
import SalidaSection from '../sections/SalidaSection';
import PedidosSection from '../sections/PedidosSection';
import ModoSection from '../sections/ModoSection';
import NavBar from '../sections/NavBar'


const HomeScreen = () => {
  

  return (
    <View style={styles.mainContainer}>
      {/* NavBar                      */}
         <NavBar/>     
    {/*                               */}
      <Text style={style.text}> Menu principal </Text>
      <View style={styles.sectionContainer}>
        <View style={styles.row}>
          <Link to={'/bienes'}>
            <View>
              <BienesSection />
            </View>
          </Link>
          <Link to={'/documentos'} >
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
              <ModoSection/>
            </View>
          </TouchableWithoutFeedback>         
        </View>
      </View>      
    </View>
  );
};

const style = StyleSheet.create({
  text: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 0,
    marginBottom: 28,
    padding: 5,
    fontSize: 15,
    backgroundColor: '#444',
  },
});

export default HomeScreen;