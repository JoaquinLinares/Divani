import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Animated, ScrollView, TextInput, StyleSheet } from 'react-native';
import MenuDesplegable from '../components/MenuDesplegable';
import { Link } from 'react-router-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { BackHandler } from 'react-native';
import { useNavigate } from 'react-router-native';
import Constants from 'expo-constants';
import styles from '../styles';
import AsyncStorage from '@react-native-async-storage/async-storage';


const PedidosScreen = () => {
  const [tableHead] = useState([
    'Articulo', 'Color', 'Tareas', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
    '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', 'Total'
  ]);
  
  const [widthArr, setWidthArr] = useState(Array(30).fill({ width: 100 }));
  const [stockData, setStockData] = useState({});
  const [currentSizeIndex, setCurrentSizeIndex] = useState(-1); // Estado para rastrear el índice del tamaño
  const [sizesQuantities, setSizesQuantities] = useState({}); // Estado para almacenar las cantidades de cada tamaño
  const [data,setData] = useState(null)
  const [menuAnimation] = useState(new Animated.Value(0));

  const history = useNavigate();

  useEffect(() => {
    const backAction = () => {
      history('/');
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [history]);

  // Estado para rastrear la fila actual
  const [currentRowIndex, setCurrentRowIndex] = useState(0);

  // Estado para guardar los valores de artículo y color
  const [articleInputs, setArticleInputs] = useState(Array(25).fill('')); // Array de 25 elementos, uno para cada fila
  const [colorInputs, setColorInputs] = useState(Array(25).fill('')); // Array de 25 elementos, uno para cada fila

  // Inicializamos los estados de las celdas con identificadores únicos
  const [rowDataStates, setRowDataStates] = useState(Array(25).fill(0).map(() => {
    return {
      rowData: Array(tableHead.length - 3).fill(0).map(() => ({ value: '', color: 'white' }))
    };
  }));

  useEffect(() => {
    const newWidthArr = tableHead.map(title => {
      return { width: title.length * 10 + 40 };
    });
    setWidthArr(newWidthArr);

    AsyncStorage.getItem('db')
      .then(data => {
        const stockData = JSON.parse(data) || {};
        setStockData(stockData);
      })
      .catch(error => {
        console.error('Error al obtener los datos del stock:', error);
      });
  }, []);

 // Actualizar el tamaño en la celda específica
// Actualizar el tamaño en la celda específica
const handleSizeChange = (text, rowIndex, columnIndex) => {
  // Crear una copia temporal de rowDataStates
  const newData = [...rowDataStates];

  // Actualizar el valor del tamaño en la copia temporal
  newData[rowIndex].rowData[columnIndex].value = text;

  // Verificar si foundStock no es nulo antes de actualizar el color
  if (data !== null && text <= data.stock) {
    newData[rowIndex].rowData[columnIndex].color = 'green'; // Actualizar el color de la celda a verde
  } else if (data !== null && text > data.stock) {
    newData[rowIndex].rowData[columnIndex].color = 'red'; // Actualizar el color de la celda a rojo
  } else {
    newData[rowIndex].rowData[columnIndex].color = 'black'; // Dejar en negro si no hay datos
  }

  // Actualizar las cantidades en el estado
  const updatedSizesQuantities = { ...sizesQuantities };
  updatedSizesQuantities[tableHead[columnIndex + 3]] = text;

  // Actualizar el estado local
  setRowDataStates(newData);
  setSizesQuantities(updatedSizesQuantities);

  setCurrentSizeIndex(columnIndex); // Actualizar el índice del tamaño
};


  // Manejar cambio de fila
  const handleRowChange = (rowIndex) => {
    setCurrentRowIndex(rowIndex);
    setCurrentSizeIndex(-1); // Restablecer el índice del tamaño al cambiar de fila
    setSizesQuantities({}); // Limpiar las cantidades al cambiar de fila
  };

  // Guardar el valor del artículo al cambiar
  const handleArticleChange = (text, rowIndex) => {
    const newArticles = [...articleInputs];
    newArticles[rowIndex] = text;
    setArticleInputs(newArticles);
  };

  // Guardar el valor del color al cambiar
  const handleColorChange = (text, rowIndex) => {
    const newColors = [...colorInputs];
    newColors[rowIndex] = text;
    setColorInputs(newColors);
  };

  useEffect(() => {
    function handleTable() {
      console.log('Estamos en la fila = ', currentRowIndex); 
      console.log(' ');
      console.log('Puso articulo=', articleInputs[currentRowIndex]);
      console.log(' ');
      console.log('Puso el color=', colorInputs[currentRowIndex]);
      console.log(' ');
      console.log('Talle =', tableHead[currentSizeIndex + 3]); // Sumar 3 para compensar el desplazamiento de las primeras 3 columnas
      console.log(' ');
      console.log('Cantidad =', sizesQuantities); // Obtener la cantidad del estado según el tamaño
    }
    handleTable();     
  
    if (currentSizeIndex !== -1) {
      const productId = `${articleInputs[currentRowIndex]}-${colorInputs[currentRowIndex]}-${tableHead[currentSizeIndex + 3]}`;
      let foundStock = null            
      
      // Iterar sobre las claves del objeto stockData para buscar el producto
      const productKeys = Object.keys(stockData);
      for (let i = 0; i < productKeys.length; i++) {
        const key = productKeys[i]; // Usar la clave del objeto
        if (productId === stockData[key].id) { 
          foundStock = stockData[key];
          break; // Salir del bucle una vez que se haya encontrado el stock
        }
      }
      foundStock ? console.log('el articulo que encontrooo', foundStock) : console.log('no se encontro el producto:', productId);
      setData(foundStock);  
    }
  }, [currentRowIndex, articleInputs, colorInputs, currentSizeIndex, sizesQuantities, tableHead, stockData, rowDataStates]);
  


 
 // Función para obtener el color del texto según el stock
const getQuantityColor = (rowIndex, columnIndex) => {   
  const quantity = rowDataStates[rowIndex].rowData[columnIndex].value;
  return rowDataStates[rowIndex].rowData[columnIndex].color; // Devolver el color de la celda
};


  const toggleMenu = () => {
    const toValue = menuAnimation._value === -250 ? 0 : -250;
    Animated.spring(menuAnimation, {
      toValue,
      useNativeDriver: false,
    }).start();
  };

  const pressPrint = () => {
    // logica para imprimir la tabla
    window.print();

  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.mainContainer}>
        <View style={[styles.navbar, { marginTop: Constants.statusBarHeight }]}>
          <View style={styles.leftIcon}>
            <Link to={'/'}>
              <FontAwesome5 name="arrow-left" size={24} color="white" />
            </Link>
          </View>
          <Text style={styles.centerText}>Pedidos</Text>
          <TouchableOpacity onPress={pressPrint}>
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
        <MenuDesplegable menuAnimation={menuAnimation} toggleMenu={toggleMenu} nombre='pedidos' />
  
        
        <ScrollView horizontal={true}>
          <View>
            <View style={stylesPedidos.ContainerImputsGeneral}>
              <View  style={stylesPedidos.ContainerDivani}>
                <Text style={stylesPedidos.divaniText}>DIVANI</Text>
                <Text style={stylesPedidos.calzadosText}>calzados</Text>
              </View>
             
                <View style={stylesPedidos.inputGroupSeñor}>
                  <Text style={stylesPedidos.inputLabel}>Señor</Text>
                  <TextInput style={stylesPedidos.inputSeñor} />
                  <Text style={stylesPedidos.inputLabel}>Localidad</Text>
                  <TextInput style={[stylesPedidos.inputloca]} />
                </View>                
              
              
                <View style={stylesPedidos.inputGroupDire}>
                  <Text style={stylesPedidos.inputLabel}>Dirección</Text>
                  <TextInput style={[stylesPedidos.input, { width: 450 }]} />
                  <Text style={stylesPedidos.inputLabel}>Embalado</Text>
                  <TextInput style={[stylesPedidos.inputloca]} />
                </View>                
              
                <View style={stylesPedidos.inputGroupDia}>
                  <Text style={stylesPedidos.inputLabel}>Día</Text>
                  <TextInput style={[stylesPedidos.input, { width: 450 }]} />
                  <Text style={stylesPedidos.inputLabel}>Fecha</Text>
                  <TextInput style={[stylesPedidos.input, { width: 450 }]} />
                </View>
              
              <View  style={stylesPedidos.ContainerDivani2}>
                <Text style={stylesPedidos.divaniText2}>DIVANI</Text>
                <Text style={stylesPedidos.calzadosText2}>calzados</Text>
              </View>
                
              
            </View>
  
            <View>
              <View style={{ flexDirection: 'row' }}>
                {tableHead.map((title, colIndex) => (
                  <View key={colIndex} style={[stylesPedidos.cell, { width: widthArr[colIndex].width }]}>
                    <Text style={stylesPedidos.text}>{title}</Text>
                  </View>
                ))}
              </View>
              {rowDataStates.map((rowDataState, rowIndex) => (
                <View key={rowIndex} style={[stylesPedidos.row, rowIndex % 2 && stylesPedidos.rowOdd]}>
                  <TextInput
                    style={[stylesPedidos.cell, { width: widthArr[0].width }]}
                    value={articleInputs[rowIndex]} // Usamos el estado para el valor del artículo
                    onChangeText={(text) => handleArticleChange(text, rowIndex)}
                    onBlur={() => handleRowChange(rowIndex)}
                  />
                  <TextInput
                    style={[stylesPedidos.cell, { width: widthArr[1].width }]}
                    value={colorInputs[rowIndex]} // Usamos el estado para el valor del color
                    onChangeText={(text) => handleColorChange(text, rowIndex)}
                    onBlur={() => handleRowChange(rowIndex)}
                  />
                  <TextInput
                    style={[stylesPedidos.cell, { width: widthArr[2].width }]}
                  />
                  {['20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
                  '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', 
                  '41', '42', '43', '44', '45'].map((size, columnIndex) => (
                    <TextInput
                      key={columnIndex}
                      style={[
                        stylesPedidos.cell,
                        { width: widthArr[columnIndex + 3].width },
                        // Estilo condicional
                        { color: getQuantityColor(rowIndex, columnIndex) }
                      ]}
                      value={rowDataState.rowData[columnIndex].value}
                      onChangeText={(text) => handleSizeChange(text, rowIndex, columnIndex)}                 
                      keyboardType='numeric'
                      onBlur={() => handleRowChange(rowIndex)}
                    />
                  ))}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
  
};

const stylesPedidos = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 35, backgroundColor: '#fff' },
  text: { textAlign: 'center', fontWeight: 'bold', color: '#111', },
  row: { flexDirection: 'row', minHeight: 50 },
  rowOdd: { backgroundColor: '#fff' },
  cell: { borderWidth: 1, borderColor: '#111', padding: 10,backgroundColor:'#fff', },
  ContainerDivani:{paddingTop:15,paddingLeft:35,marginRight:10},
  ContainerDivani2:{position:'absolute',right:100,top:20},
  
  ContainerImputsGeneral:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',    
    backgroundColor:'#fff', 
    borderColor:'#111'   
  },
  divaniText: { fontSize: 30, fontWeight: 'bold', color: 'black', textAlign: 'center',paddingTop:18},
  divaniText2: { fontSize: 30, fontWeight: 'bold', color: 'black', textAlign: 'center',paddingTop:18},
  calzadosText: { fontSize: 16, color: 'black', alignSelf:'center'},  
  calzadosText2: { fontSize: 16, color: 'black', alignSelf:'center'},  
  inputsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  inputGroupSeñor: {paddingRight:1320, margin:5,},
  inputGroupDire:{ margin:5,position:'absolute',
    left:700,
  },
  inputGroupDia:{ margin:5,position:'absolute',
  right:280
},
  inputLabel: { fontSize: 16, color: 'black', marginBottom: 5 },
  inputLabelEmba:{ fontSize: 16, color: 'black', },
  inputSeñor: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'gray',
    height: 30, // Ajusta la altura
    width: 450,
    paddingVertical: 5, // Padding vertical
    paddingHorizontal: 10, // Padding horizontal
    marginBottom: 10, // Ajusta el margen inferior
  },
  inputloca: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'gray',
    height: 30, // Ajusta la altura
    width: 450,
    paddingVertical: 5, // Padding vertical
    paddingHorizontal: 10, // Padding horizontal
    marginBottom: 10, // Ajusta el margen inferior
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'gray',
    height: 30, // Ajusta la altura
    paddingHorizontal: 10, // Padding horizontal
    marginBottom: 10, // Ajusta el margen inferior
  },
 
});


export default PedidosScreen;
