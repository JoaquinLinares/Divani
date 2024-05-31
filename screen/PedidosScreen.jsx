import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, Animated, ScrollView, TextInput, StyleSheet } from 'react-native';
import MenuDesplegable from '../components/MenuDesplegable';
import { Link } from 'react-router-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { BackHandler } from 'react-native';
import { useNavigate } from 'react-router-native';
import Constants from 'expo-constants';
import styles from '../styles';
import { ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as MailComposer from 'expo-mail-composer';
import * as Print from 'expo-print';


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
  const [loading, setLoading] = useState(true); //estado de carga
// estados del rectangulo superior
  const [senor, setSenor] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [direccion, setDireccion] = useState('');
  const [embalado, setEmbalado] = useState('');
  const [dia, setDia] = useState('');
  const [fecha, setFecha] = useState('');
  const [pdfUri,setPdfUri] = useState(null)



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
      })
      .finally(() => {
        setLoading(false); // Datos cargados, ocultar el indicador de carga
      });
  }, []);
 
// Actualizar el tamaño en la celda específica
const handleSizeChange = (text, rowIndex, columnIndex) => {
  // Crear una copia temporal de rowDataStates
  const newData = [...rowDataStates];

  // Actualizar el valor del tamaño en la copia temporal
  newData[rowIndex].rowData[columnIndex].value = text;

  // Verificar si foundStock no es nulo antes de actualizar el color
  if (data !== null && text <= data.stock) {
    newData[rowIndex].rowData[columnIndex].color = 'white'; // Actualizar el color de la celda a verde
  } else if (data !== null && text > data.stock) {
    newData[rowIndex].rowData[columnIndex].color = 'red'; // Actualizar el color de la celda a rojo
  } else {
    newData[rowIndex].rowData[columnIndex].color = 'white'; // Dejar en negro si no hay datos
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
      
      setData(foundStock);  
    }
  }, [currentRowIndex, articleInputs, colorInputs, currentSizeIndex, sizesQuantities, tableHead, stockData, rowDataStates]);

   /////////////////////// Funcion para generar el pdf

   const generatePDF = async () => {
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
          .inputGroup {
            margin-bottom: 20px;
          }
          .inputGroup label {
            display: block;
            font-weight: bold;
          }
          .inputGroup span {
            display: block;
            margin-top: 5px;
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
          .containerDivani{
            padding-top: 10px ;
            margin-top:15px ;
          }
          .inputRectangle {
            background-color: white;
            border: 1px solid black;
            padding: 10px;
            margin-bottom: 20px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
          }
          .inputGroupSeñor, .inputGroupDire, .inputGroupDia {
            padding: 5px;
          }
          .inputLabel {
            font-size: 16px;
            text-align: center ;
            color: black;
            margin-bottom: 5px;
          }
          .input {
            border: 1px solid gray;
            border-radius: 5px;
            width:250px ;
            height: 30px;
            padding: 5px 10px;
            margin-bottom: 10px;
          }
          .divaniText, .divaniText2 {
            font-size: 30px;
            font-weight: bold;
            color: black;
            text-align: center;
            padding-top: 18px;
          }
          .calzadosText, .calzadosText2 {
            font-size: 16px;
            color: black;
            text-align: center;
            align-self: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Pedido</h1>
          </div>
          <div class="inputRectangle">
            <div class="containerDivani">
              <div class="divaniText">Fabrica</div>
              <div class="calzadosText">de calzados</div>
            </div>
            <div class="inputGroupSeñor">
              <div class="inputLabel">Señor</div>
              <div class="input">${senor}</div>
              <div class="inputLabel">Localidad</div>
              <div class="input">${localidad}</div>
            </div>
            <div class="inputGroupDire">
              <div class="inputLabel">Dirección</div>
              <div class="input">${direccion}</div>
              <div class="inputLabel">Embalado</div>
              <div class="input">${embalado}</div>
            </div>
            <div class="inputGroupDia">
              <div class="inputLabel">Día</div>
              <div class="input">${dia}</div>
              <div class="inputLabel">Fecha</div>
              <div class="input">${fecha}</div>
            </div>
            <div class="containerDivani">
              <div class="divaniText2">Fabrica</div>
              <div class="calzadosText2">de calzados</div>
            </div>
          </div>
          <table class="table">
            <thead>
              <tr>
                ${tableHead.map((head) => `<th>${head}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${rowDataStates.map((rowData, rowIndex) => `
                <tr>
                  <td>${articleInputs[rowIndex]}</td>
                  <td>${colorInputs[rowIndex]}</td>
                  <td></td>
                  ${rowData.rowData.map((cellData, columnIndex) => `
                    <td style="background-color: ${getQuantityColor(rowIndex, columnIndex)}">${cellData.value}</td>
                  `).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `;
  
    try {
      await Print.printAsync({
        html: htmlContent,
      });
      alert('PDF generado y enviado a imprimir.');
    } catch (error) {
      console.error('Error al generar el PDF:', error);
    }
  };
  

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

  const sendEmail = async () => {
    try {
      // Permitir que el usuario elija un archivo
      const file = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
  
      console.log('Resultado del selector de documentos:', file);
  
      if (!file.canceled && file.assets && file.assets.length > 0) {
        const selectedFile = file.assets[0];
        const options = {
          recipients: ['lafabricadecalzados.admi@gmail.com'], // La dirección de correo electrónico del destinatario
          subject: 'Pedido',         
          attachments: [selectedFile.uri], // Adjunta el archivo seleccionado al correo electrónico
        }; 
        
  
        // Enviar correo electrónico con el archivo adjunto
        await MailComposer.composeAsync(options);
      } else {
        console.log('El usuario canceló la selección de archivo.');
      }
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
    }
  };  
  

  return (
    <View style={{ flex: 1 }}>
      {loading && (
        <View style={stylesPedidos.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      {!loading && (
        <ScrollView style={{ flex: 1 }}>
          <View style={styles.mainContainer}>
            <View style={styles.navbar}>
              <View style={styles.leftIcon}>
                <Link to={'/'}>
                  <FontAwesome5 name="arrow-left" size={24} color="white" />
                </Link>
              </View>
              <Text style={styles.centerText}>Pedidos</Text>
              <TouchableOpacity onPress={generatePDF}>
                <View style={styles.rightIcon}>
                  <FontAwesome5 name="print" size={24} color="white" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={sendEmail}>
                <View style={styles.rightIcon}>
                  <FontAwesome5 name="envelope" size={24} color="white" />
                </View>
              </TouchableOpacity>
              <View style={styles.rightIcon}>
                <TouchableOpacity onPress={toggleMenu}>
                  <FontAwesome5 name="bars" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
            <MenuDesplegable menuAnimation={menuAnimation} toggleMenu={toggleMenu} nombre='pedidos' />
  
            <ScrollView horizontal={true}>
              <View>
                <View style={stylesPedidos.ContainerImputsGeneral}>
                  <View style={stylesPedidos.ContainerDivani}>
                    <Text style={stylesPedidos.divaniText}>FABRICA</Text>
                    <Text style={stylesPedidos.calzadosText}>de calzados</Text>
                  </View>
  
                  <View style={stylesPedidos.inputGroupSeñor}>
                    <Text style={stylesPedidos.inputLabel}>Señor</Text>
                    <TextInput style={stylesPedidos.inputSeñor} value={senor} onChangeText={setSenor} />
                    <Text style={stylesPedidos.inputLabel}>Localidad</Text>
                    <TextInput style={[stylesPedidos.inputloca]} value={localidad} onChangeText={setLocalidad} />
                  </View>
  
                  <View style={stylesPedidos.inputGroupDire}>
                    <Text style={stylesPedidos.inputLabel}>Dirección</Text>
                    <TextInput style={[stylesPedidos.input, { width: 450 }]} value={direccion} onChangeText={setDireccion} />
                    <Text style={stylesPedidos.inputLabel}>Embalado</Text>
                    <TextInput style={[stylesPedidos.inputloca]} value={embalado} onChangeText={setEmbalado} />
                  </View>
  
                  <View style={stylesPedidos.inputGroupDia}>
                    <Text style={stylesPedidos.inputLabel}>Día</Text>
                    <TextInput style={[stylesPedidos.input, { width: 450 }]} value={dia} onChangeText={setDia} />
                    <Text style={stylesPedidos.inputLabel}>Fecha</Text>
                    <TextInput style={[stylesPedidos.input, { width: 450 }]} value={fecha} onChangeText={setFecha} />
                  </View>
  
                  <View style={stylesPedidos.ContainerDivani2}>
                    <Text style={stylesPedidos.divaniText2}>Fabrica</Text>
                    <Text style={stylesPedidos.calzadosText2}>de calzados</Text>
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
                              { backgroundColor: getQuantityColor(rowIndex, columnIndex) }
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
      )}
    </View>
  );
  
};

const stylesPedidos = StyleSheet.create({
   container: { flex: 1, padding: 16, paddingTop: 35, backgroundColor: '#fff' },
  text: { textAlign: 'center', fontWeight: 'bold', color: '#111' },
  row: { flexDirection: 'row', minHeight: 50 },
  rowOdd: { backgroundColor: '#fff' },
  cell: { borderWidth: 1, borderColor: '#111', padding: 10, backgroundColor: '#fff' },
  ContainerDivani: { paddingTop: 15, paddingLeft: 35, marginRight: 10 },
  ContainerDivani2: { position: 'absolute', right: 100, top: 20 },
  ContainerImputsGeneral: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderColor: '#111'
  },
  divaniText: { fontSize: 30, fontWeight: 'bold', color: 'black', textAlign: 'center', paddingTop: 18 },
  divaniText2: { fontSize: 30, fontWeight: 'bold', color: 'black', textAlign: 'center', paddingTop: 18 },
  calzadosText: { fontSize: 16, color: 'black', alignSelf: 'center' },
  calzadosText2: { fontSize: 16, color: 'black', alignSelf: 'center' },
  inputsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  inputGroupSeñor: { paddingRight: 1320, margin: 5 },
  inputGroupDire: { margin: 5, position: 'absolute', left: 700 },
  inputGroupDia: { margin: 5, position: 'absolute', right: 280 },
  inputLabel: { fontSize: 16, color: 'black', marginBottom: 5 },
  inputLabelEmba: { fontSize: 16, color: 'black' },
  inputSeñor: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'gray',
    height: 30,
    width: 450,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  inputloca: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'gray',
    height: 30,
    width: 450,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'gray',
    height: 30,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.8)'
  },
});
 



export default PedidosScreen;