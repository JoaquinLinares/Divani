import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, StyleSheet, Animated, Modal, TextInput } from 'react-native';
import { BackHandler } from 'react-native';
import { useNavigate } from 'react-router-native';
import Constants from 'expo-constants';
import { Link } from 'react-router-native';
import { FontAwesome5 } from '@expo/vector-icons';
import MenuDesplegable from '../components/MenuDesplegable';
import { getAllItems } from '../services/async-storage/async-storage-read';
import {   addItem  } from '../services/async-storage/async-storage-write'; // Importamos el nuevo método
import styles from '../styles';
import * as Print from 'expo-print';


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
  const [tableHead] = useState([
    'Articulo', 'Color', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
    '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'
  ]);

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

    const { id, articulo, color, talle, stock } = newProduct;

    if (!id || !articulo || !color || !talle || !stock) {
    // Opcional: puedes mostrar un mensaje de error al usuario aquí
    alert('Por favor, complete todos los campos.');
    return;
  }
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

  /////////////////////// Funcion para generar el pdf

  const generatePDF = async () => {
    // Agrupar los datos por artículo y color
    const groupedData = bienesStock.reduce((acc, item) => {
      const { articulo, color, talle, stock } = item;
  
      if (!acc[articulo]) {
        acc[articulo] = {};
      }
      if (!acc[articulo][color]) {
        acc[articulo][color] = {};
      }
      acc[articulo][color][talle] = stock;
  
      return acc;
    }, {});
  
    // Generar el contenido HTML para el PDF
    let htmlContent = `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          .container {
            padding: 16px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
          }
          .table th, .table td {
            border: 1px solid black;
            padding: 8px;
            text-align: center;
          }
          .table th {
            background-color: #f2f2f2;
          }
          .article-cell {
            background-color: #f9f9f9;
            font-weight: bold;
          }
          .color-cell {
            background-color: #e9e9e9;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>STOCK GENERAL</h1>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Artículo</th>
                <th>Color</th>
                ${tableHead.slice(2).map((size) => `<th>${size}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${Object.keys(groupedData).map((articulo) => {
                const colorRows = Object.keys(groupedData[articulo]).map((color, index) => {
                  const stockCells = tableHead.slice(2).map((size) => {
                    const stock = groupedData[articulo][color][size] || ' ';
                    return `<td>${stock}</td>`;
                  }).join('');
  
                  return `
                    <tr>
                      ${index === 0 ? `<td class="article-cell" rowspan="${Object.keys(groupedData[articulo]).length}">${articulo}</td>` : ''}
                      <td class="color-cell">${color}</td>
                      ${stockCells}
                    </tr>
                  `;
                }).join('');
  
                return colorRows;
              }).join('')}
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `;
  
    try {
      await Print.printAsync({ html: htmlContent });
      alert('PDF generado y enviado a imprimir.');
    } catch (error) {
      console.error('Error al generar el PDF:', error);
    }
  };  

  return (
    <View style={styles.mainContainer}>
      {/* NavBar de Bienes */}
      <View style={styles.navbar}>
        <View style={styles.leftIcon}>
          <Link to={'/'}>
            <FontAwesome5 name="arrow-left" size={24} color="white" />
          </Link>
        </View>
        <Text style={styles.centerText}>Bienes</Text>   
        <TouchableOpacity onPress={generatePDF}>
            <View style={styles.rightIcon}>
              <FontAwesome5 name="print" size={24} color="white" />
            </View>
          </TouchableOpacity>    
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
              placeholder='Nombre (1218-NEGRO-37)'
              placeholderTextColor='#fff' // Color del placeholder
              value={newProduct.id}
              onChangeText={(text) => setNewProduct({ ...newProduct, id: text })}
            />
            <TextInput
              style={stylesBienes.input}
              placeholder="Artículo"
              placeholderTextColor='#fff' // Color del placeholder
              value={newProduct.articulo}
              onChangeText={(text) => setNewProduct({ ...newProduct, articulo: text })}
            />
            <TextInput
              style={stylesBienes.input}
              placeholder="Color"
              placeholderTextColor='#fff' // Color del placeholder
              value={newProduct.color}
              onChangeText={(text) => setNewProduct({ ...newProduct, color: text })}
            />
            <TextInput
              style={stylesBienes.input}
              placeholder="Talle"
              placeholderTextColor='#fff' // Color del placeholder
              value={newProduct.talle}
              onChangeText={(text) => setNewProduct({ ...newProduct, talle: text })}
            />
            <TextInput
              style={stylesBienes.input}
              placeholder="Stock"
              placeholderTextColor='#fff' // Color del placeholder
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
    width: '100%',    
    padding: 20,
    borderWidth:2,
    margin:5,
    borderColor:'#6A6A11',
    paddingTop: 15,
    textAlign: 'center',
    alignItems: 'center',
    alignSelf: 'center',    
    borderRadius: 5,
  },
  articleTitle: {
    fontWeight: 'bold',
    fontSize: 26,
    marginBottom: 2,
    color:'#fff'
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#6A6A11',
    width: 60,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#111',
    width: '80%',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color:'#fff'
  },
  input: {
    borderWidth: 1,
    borderColor: '#6A6A11',
    borderRadius: 5,
    color:'#fff',
    padding: 10,
    marginBottom: 10,
  }, 
  addButton: {
    backgroundColor: '#6A6A11',
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

