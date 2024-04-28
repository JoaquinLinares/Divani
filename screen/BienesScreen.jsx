import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, StyleSheet, Animated, Modal, TextInput } from 'react-native';
import { BackHandler } from 'react-native';
import { useNavigate } from 'react-router-native';
import Constants from 'expo-constants';
import { Link } from 'react-router-native';
import { FontAwesome5 } from '@expo/vector-icons';
import MenuDesplegable from '../components/MenuDesplegable';
import { getAllItems } from '../services/async-storage/async-storage-read';
import { addItem } from '../services/async-storage/async-storage-write'; // Importamos el nuevo método
import styles from '../styles';

const BienesScreen = () => {
  const [bienesStock, setBienesStock] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newProduct, setNewProduct] = useState({
    id: '',
    articulo: '',
    color: '',
    talle: '',
    stock: '',
  });

  useEffect(() => {
    async function fetchBienesStock() {
      try {
        const data = await getAllItems();
        setBienesStock(data);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    }

    fetchBienesStock();
  }, []);

  const history = useNavigate();

  useEffect(() => {
    const backAction = () => {
      history('/');
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [history]);

  const menuAnimation = new Animated.Value(0);

  const toggleMenu = () => {
    const toValue = menuAnimation._value === -250 ? 0 : -250;
    Animated.spring(menuAnimation, {
      toValue,
      useNativeDriver: false,
    }).start();
  }; 

  const handleArticlePress = (article) => {
    history(`/stock/${encodeURIComponent(article)}`);
  };

  const renderArticle = (article) => {
    return (
      <View key={article.articulo} style={stylesBienes.articleContainer}>
        <TouchableOpacity onPress={() => handleArticlePress(article.articulo)}>
          <Text style={stylesBienes.articleTitle}>Artículo: {article.articulo}</Text>
        </TouchableOpacity>               
      </View>
    );
  };

  const renderArticles = () => {
    const groupedArticles = bienesStock.reduce((acc, item) => {
      if (!acc[item.articulo]) {
        acc[item.articulo] = [];
      }
      acc[item.articulo].push({ id: item.id, stock: item.stock });
      return acc;
    }, {});

    return Object.entries(groupedArticles).map(([articulo, colors]) => {
      return renderArticle({ articulo, colors });
    });
  };

  const handleCreateNewProduct = async () => {
    try {
      await addItem(newProduct); // Usamos el nuevo método para agregar el nuevo producto
      setModalVisible(false);
      setNewProduct({
        id: '',
        articulo: '',
        color: '',
        talle: '',
        stock: '',
      });
      const data = await getAllItems();
      setBienesStock(data);
    } catch (error) {
      console.error('Error al crear el nuevo producto:', error);
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* NavBar de Bienes */}
      <View style={[styles.navbar, { marginTop: Constants.statusBarHeight }]}>
        <View style={styles.leftIcon}>
          <Link to={'/'}>
            <FontAwesome5 name="arrow-left" size={24} color="white" />
          </Link>
        </View>
        <Text style={styles.centerText}>Bienes</Text>
        <View style={styles.rightIcon}>
          <FontAwesome5 name="file-excel" size={24} color="white" />
        </View>
        <View style={styles.rightIcon}>
          <TouchableOpacity onPress={toggleMenu}>
            <FontAwesome5 name='bars' size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      {/* Menu desplegable */}
      <MenuDesplegable menuAnimation={menuAnimation} toggleMenu={toggleMenu} nombre='bienes' />
      <ScrollView contentContainerStyle={stylesBienes.container}>
        {renderArticles()}
      </ScrollView>
      {/* Botón flotante para agregar nuevo producto */}
      <TouchableOpacity
        style={stylesBienes.floatingButton}
        onPress={() => setModalVisible(true)}>
        <FontAwesome5 name="box" size={24} color="white" />
      </TouchableOpacity>
      {/* Modal para agregar nuevo producto */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={stylesBienes.modalContainer}>
          <View style={stylesBienes.modalContent}>
            <Text style={stylesBienes.modalTitle}>Agregar Nuevo Producto</Text>
            <TextInput
              style={stylesBienes.input}
              placeholder="Nombre"
              value={newProduct.id}
              onChangeText={(text) => setNewProduct({ ...newProduct, id: text })}
            />
            <TextInput
              style={stylesBienes.input}
              placeholder="Artículo"
              value={newProduct.articulo}
              onChangeText={(text) => setNewProduct({ ...newProduct, articulo: text })}
            />
            <TextInput
              style={stylesBienes.input}
              placeholder="Color"
              value={newProduct.color}
              onChangeText={(text) => setNewProduct({ ...newProduct, color: text })}
            />
            <TextInput
              style={stylesBienes.input}
              placeholder="Talle"
              value={newProduct.talle}
              onChangeText={(text) => setNewProduct({ ...newProduct, talle: text })}
            />
            <TextInput
              style={stylesBienes.input}
              placeholder="Stock"
              value={newProduct.stock}
              onChangeText={(text) => setNewProduct({ ...newProduct, stock: text })}
            />
            <TouchableOpacity
              style={stylesBienes.addButton}
              onPress={handleCreateNewProduct}>
              <Text style={stylesBienes.addButtonText}>Agregar Producto</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};


const stylesBienes = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  articleContainer: {
    width: '80%',
    margin: 10,
    padding: 10,
    paddingTop: 15,
    textAlign: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  articleTitle: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 5,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007bff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default BienesScreen;

