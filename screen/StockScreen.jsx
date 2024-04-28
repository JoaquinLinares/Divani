import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, StyleSheet, BackHandler, TextInput, TouchableHighlight, Modal, Button } from 'react-native';
import { Link, useNavigate, useParams } from 'react-router-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { getItemById } from '../services/async-storage/async-storage-read'; // Importa la función para obtener y actualizar los datos del almacenamiento
import { updateItemById } from '../services/async-storage/async-storage-write';
import styles from '../styles';

const StockScreen = () => {
  let { article } = useParams(); // Obtener el artículo de la URL

  const [stock, setStock] = useState([]); // Estado para almacenar el stock del artículo
  const [selectedArticle, setSelectedArticle] = useState(null); // Estado para almacenar el artículo seleccionado
  const [newStock, setNewStock] = useState(''); // Estado para almacenar el nuevo stock introducido

  useEffect(() => {
    // Función asincrónica para obtener el artículo por su ID
    const fetchArticle = async () => {
      try {
        const articleData = await getItemById(article);          
        if (articleData) {
          setStock(articleData);
        }           
      } catch (error) {
        console.error('Error al obtener el artículo:', error);
      }
    };      

    fetchArticle(); // Llamar a la función para obtener el artículo cuando se monta el componente
  }, [article]); // Ejecutar el efecto cuando el artículo cambie

  const history = useNavigate();

  useEffect(() => {
    const backAction = () => {
      history('/bienes'); // Navega de vuelta a la pantalla de bienes
      return true; // Evita que la aplicación se cierre al presionar el botón de retroceso
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [history]);

  const handlePressArticle = (id, stock) => {
    setSelectedArticle({ id, stock });
  }

  const handleChangeStock = async () => {
    if (newStock.trim() === '') {
      alert('Por favor, introduce un valor válido para el stock.');
      return;
    }
  
    // Actualizar el stock en la base de datos
    try {
      await updateItemById(selectedArticle.id, { stock: parseInt(newStock) });
      setStock(stock.map(item => item.id === selectedArticle.id ? { ...item, stock: parseInt(newStock) } : item));
      setNewStock('');
      setSelectedArticle(null);
    } catch (error) {
      console.error('Error al actualizar el stock:', error);
    }
  }  

  return (
    <View style={styles.mainContainer}>
      {/* NavBar de Stock */}
      <View style={[styles.navbar, { marginTop: Constants.statusBarHeight }]}>
        <View style={styles.leftIcon}>
          {/* Icono de volver para atrás */}
          <Link to={'/bienes'}>
            <FontAwesome5 name="arrow-left" size={24} color="white" />
          </Link>
        </View>
        <Text style={styles.centerTextStock}>Stock de: {article}</Text>       
      </View>

      <ScrollView contentContainerStyle={stylesStock.container}>
        {/* Mapear el stock y mostrar cada elemento como un rectángulo */}
        {stock.map((item, index) => (
          <TouchableHighlight key={index} onPress={() => handlePressArticle(item.id, item.stock)}>
            <View style={stylesStock.stockItem}>
              <Text style={stylesStock.colorText}>{`Nombre: ${item.id}`}</Text>
              <Text style={stylesStock.stockText}>{`Stock: ${item.stock}`}</Text>
            </View>
          </TouchableHighlight>
        ))}          
      </ScrollView>

      {/* Modal para cambiar el stock */}
      <Modal
        visible={selectedArticle !== null}
        animationType="slide"
        transparent={true}
      >
        <View style={stylesStock.modalContainer}>
          <View style={stylesStock.modalContent}>
            <Text style={stylesStock.modalTitle}>Modificar Stock</Text>
            <Text>ID: {selectedArticle?.id}</Text>
            <Text>Stock Actual: {selectedArticle?.stock}</Text>
            <TextInput
              style={stylesStock.input}
              placeholder="Nuevo Stock"
              onChangeText={text => setNewStock(text)}
              keyboardType="numeric"
              value={newStock}
            />
            <Button title="Guardar Cambios" onPress={handleChangeStock} />
            <Button title="Cancelar" onPress={() => setSelectedArticle(null)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const stylesStock = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  stockItem: {
    width: '80%',
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
  },
  colorText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  stockText: {
    fontSize: 16,
    marginTop: 5,
  },
  centerTextStock: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
}
);

export default StockScreen;
