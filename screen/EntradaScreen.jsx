import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableWithoutFeedback, Image, ScrollView, useWindowDimensions, TouchableOpacity, Animated, Modal, TextInput, Button } from 'react-native';
import { BackHandler } from 'react-native';
import { useNavigate } from 'react-router-native';
import { Camera } from 'expo-camera';
import { FontAwesome5 } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { Link } from 'react-router-native';
import styles from '../styles';
import imageSource from '../assets/Box-Transparent-PNG.webp';
import MenuDesplegable from '../components/MenuDesplegable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateItem } from '../services/async-storage/async-storage-write'; 
import { getAllItems } from '../services/async-storage/async-storage-read';

const EntradaScreen = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scannedData, setScannedData] = useState([]);
    const [scanMessage, setScanMessage] = useState("");
    const [openCamera, setOpenCamera] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [flashOn, setFlashOn] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItemIndex, setSelectedItemIndex] = useState(null);
    const [newStockCount, setNewStockCount] = useState("");
    const [currentDate, setCurrentDate] = useState("");
    const history = useNavigate();
    const window = useWindowDimensions();

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

  

    // Función para manejar el evento de retroceso del dispositivo
    const handleBackPress = () => {
        if (openCamera) {
            setOpenCamera(false); // Cierra la cámara si está abierta
            return true; // Evita que la aplicación se cierre al presionar el botón de retroceso
        } else {
            setScannedData([]); // Reinicia los datos escaneados al volver al home
            history('/'); // Navega de vuelta a la pantalla de inicio (HomeScreen)
            return true; // Evita que la aplicación se cierre al presionar el botón de retroceso
        }
    };

    // Efecto para manejar el evento de retroceso del dispositivo
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress); // Registra el evento de retroceso del dispositivo

        return () => backHandler.remove(); // Limpia el evento de retroceso al desmontar el componente
    }, [openCamera]); // Ejecuta el efecto cuando cambia el estado de openCamera

    // Efecto para obtener la fecha actual
    useEffect(() => {
        const currentDate = new Date().toLocaleDateString(); // Obtiene la fecha actual
        setCurrentDate(currentDate); // Almacena la fecha actual en el estado
    }, []); // Se ejecuta solo una vez al montar el componente

    // Función para manejar el escaneo de códigos de barras
    const handleBarCodeScanned = async ({ type, data }) => {
        if (!isScanning) {
            setIsScanning(true); // Inicia el escaneo
    
            // Muestra un mensaje de escaneo
            setScanMessage(` Producto escaneado - ${data}`);
    
            // Verifica si el producto ya ha sido escaneado antes
            const existingProductIndex = scannedData.findIndex(item => item.data === data);
            if (existingProductIndex !== -1) {
                // Si el producto ya ha sido escaneado, incrementa la cantidad
                const updatedScannedData = [...scannedData];
                updatedScannedData[existingProductIndex].count += 1;
                setScannedData(updatedScannedData);
    
                // Incrementa la cantidad del producto en AsyncStorage
                let storedMovimientos = await AsyncStorage.getItem('movements');
                storedMovimientos = storedMovimientos ? JSON.parse(storedMovimientos) : { movements: [], created_at: '' };
                const existingMovementIndex = storedMovimientos.movements.findIndex(item => item.producto === data.slice(0, -1) && item.tipo === 'entrada');
                if (existingMovementIndex !== -1) {
                    storedMovimientos.movements[existingMovementIndex].cantidad += 1;
                }
                await AsyncStorage.setItem('movements', JSON.stringify(storedMovimientos));
            } else {
                // Si es un nuevo producto, verifica si existe en el almacenamiento
                const allItems = await getAllItems();
                const existingProductIndex = allItems.findIndex(item => item.id === data.slice(0, -1));
    
                if (existingProductIndex !== -1 ) {
                    // Si el producto existe, agrega un nuevo elemento a la lista
                    setScannedData(prevData => {
                        const existingIndex = prevData.findIndex(item => item.data === data);
                        if (existingIndex !== -1) {
                            const updatedData = [...prevData];
                            updatedData[existingIndex].count += 1;
                            return updatedData;
                        } else {
                            return [...prevData, { type, data, count: 1 }];
                        }
                    });
                    // Agrega el movimiento al AsyncStorage
                    let storedMovimientos = await AsyncStorage.getItem('movements');
                    storedMovimientos = storedMovimientos ? JSON.parse(storedMovimientos) : { movements: [], created_at: '' };
                    const nuevoProducto = { tipo: 'entrada', producto: data.slice(0, -1), cantidad: 1, fecha: currentDate };
                    storedMovimientos.movements.push(nuevoProducto);
                    await AsyncStorage.setItem('movements', JSON.stringify(storedMovimientos));
                    
                } else {
                    // Si el producto no existe, muestra un mensaje
                    setScanMessage(` Producto no encontrado - ${data}`);
                }
            }

            // Elimina la última letra del código escaneado
            const trimmedData = data.slice(0, -1);
    
            // Verifica si el producto coincide con algún ID en el AsyncStorage
            const allItems = await getAllItems();
            const existingProductIndexx = allItems.findIndex(item => item.id === trimmedData);
    
            if (existingProductIndexx !== -1) {
                // Si el producto existe, actualiza su stock sumando 1
                const updatedItem = { ...allItems[existingProductIndexx], stock: allItems[existingProductIndexx].stock + 1 };
                await updateItem(trimmedData, updatedItem); // Actualiza el item en el AsyncStorage
                setScanMessage(` Datos - ${data}`);
            } else {
                setScanMessage(` Producto no encontrado - ${data}`);
            }            
    
            // Después de 2.5 segundos, habilita nuevamente el escaneo
            setTimeout(() => {
                setIsScanning(false);
            }, 2500);
    
            setTimeout(() => {
                setScanMessage("");
            }, 2100);
        }
    };
    
    
    
    // Función para alternar el estado del flash
    const toggleFlash = () => {
        setFlashOn(!flashOn);
    };

    // Menu desplegable
    const menuAnimation = new Animated.Value(0); // Valor inicial fuera de la pantalla

    const toggleMenu = () => {
        const toValue = menuAnimation._value === -250 ? 0 : -250; // Determina el nuevo valor de la animación
        Animated.spring(menuAnimation, {
            toValue,
            useNativeDriver: false, // Necesario para que funcione en Android
        }).start();
    };

    // Función para abrir el modal y establecer el índice del ítem seleccionado
    const openModal = (index) => {
        setSelectedItemIndex(index);
        setModalVisible(true);
    };

    // Función para cerrar el modal y restablecer el índice del ítem seleccionado
    const closeModal = () => {
        setSelectedItemIndex(null);
        setModalVisible(false);
    };

    // Función para manejar el cambio de stock    
    const handleChangeStock = async () => {
        if (selectedItemIndex !== null) {
            const allItems = await getAllItems();
            const selectedItem = scannedData[selectedItemIndex];
            const updatedItemIndex = allItems.findIndex(item => item.id === selectedItem.data.slice(0, -1));

            if (updatedItemIndex !== -1) {
                // Solo actualiza el stock si se encuentra el ítem
                const updatedItem = {
                    ...allItems[updatedItemIndex],
                    stock: parseInt(allItems[updatedItemIndex].stock) + parseInt(newStockCount)
                };
                await updateItem(selectedItem.data.slice(0, -1), updatedItem);
                
                // Actualiza el contador de la lista de escaneados
                const updatedScannedData = [...scannedData];
                updatedScannedData[selectedItemIndex].count += parseInt(newStockCount);
                setScannedData(updatedScannedData);
                
            }
            closeModal();
        }
    };
    


    // Renderización del componente
    return (
        <View style={styles.mainContainer}>
            {/* NavBar de Entrada */}
            {!openCamera && (
                <View style={styles.navbar}>
                    <View style={styles.leftIcon}>
                        {/* Icono de volver para atrás */}
                        <Link to={'/'}>
                            <FontAwesome5 name="arrow-left" size={24} color="white" />
                        </Link>
                    </View>
                    <Text style={styles.centerText}>Entrada</Text>
                    <View style={styles.rightIcon}>
                        {/* Icono del scanner */}
                        <TouchableWithoutFeedback onPress={() => setOpenCamera(true)}>
                            <FontAwesome5 name="barcode" size={24} color="white" />
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.rightIcon}>
                        {/* Icono de la barra de tres rayas */}
                        <TouchableOpacity onPress={toggleMenu}>
                            <FontAwesome5 name='bars' size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Contenido de la sección */}
            {!openCamera && (
                <View style={styles.sectionContainer}>
                    {scannedData.length > 0 ? ( // Renderiza los datos escaneados si hay algún elemento
                        <><View>
                            <Text style={stylesBienes.text}>Articulos escaneados <FontAwesome5 name='arrow-down' size={20} color='white' /></Text>
                        </View><ScrollView style={[stylesBienes.scrollView, { maxHeight: window.height - Constants.statusBarHeight - 220 }]}>
                            {scannedData.map((item, index) => (
                                
                                <TouchableWithoutFeedback key={index} onPress={() => openModal(index)}>
                                    <View style={stylesBienes.scannedItem}>
                                        <Text style={stylesBienes.scannedDataText}>
                                            {item.data}
                                        </Text>
                                        <Text style={stylesBienes.scannedCountText}>
                                            {item.count}
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            ))}
                        </ScrollView></>
                    ) : (
                        // Esto se muestra cuadno no hay productos escaneados
                        <View style={stylesIMG.imageContainer}>
                            <Image source={imageSource} style={stylesIMG.image} />
                            <Text style={stylesIMG.largeText}>Agregar sus artículos</Text>
                        </View>
                    )}
                </View>
            )}
             <MenuDesplegable menuAnimation={menuAnimation} toggleMenu={toggleMenu} nombre='entrada' />

            {/* Modal para cambiar el stock */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={stylesModal.modalContainer}>
                    <View style={stylesModal.modalContent}>
                        <Text style={stylesModal.modalTitle}>Modificar Entrada</Text>
                        <TextInput
                            style={stylesModal.modalInput}
                            keyboardType="numeric"
                            placeholder="Cantidad a agregar"
                            placeholderTextColor={'#fff'}
                            onChangeText={text => setNewStockCount(text)}
                        />
                        <View style={stylesModal.modalButtonContainer}>
                            <Button title="Cancelar" onPress={closeModal} />
                            <Button title="Guardar" onPress={handleChangeStock} />
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Renderiza la cámara si está abierta */}
            {openCamera &&  hasPermission &&(
                <View style={styles.cameraContainer}>
                    <Camera
                        onBarCodeScanned={handleBarCodeScanned}
                        style={StyleSheet.absoluteFill}
                        flashMode={flashOn ? 'torch' : 'off'} // Configura el modo de flash
                    />
                    {/* Mensaje de escaneo */}
                    {scanMessage !== "" && (
                        <View style={styles.scanRectContainer}>
                            <Text style={styles.text}>{scanMessage}</Text>
                        </View>
                    )}
                    {/* Botón para alternar el flash */}
                    <TouchableWithoutFeedback onPress={toggleFlash}>
                        <View style={styles.flashButton}>
                            <FontAwesome5 name={flashOn ? "bolt" : "bolt"} size={24} color={flashOn ? "#FFF" : "rgba(255, 255, 255, 0.5)"} />
                        </View>
                    </TouchableWithoutFeedback>
                    {/* Botón para cerrar la cámara */}
                    <TouchableWithoutFeedback onPress={handleBackPress}>
                        <View style={styles.closeIcon}>
                            <FontAwesome5 name="times" size={24} color="white" />
                        </View>
                    </TouchableWithoutFeedback>
                    {/* Rectángulo de escaneo */}
                    <View style={styles.scanRect} />
                </View>
            )}
        </View>
    );
};

// Estilos del NavBar
const stylesBienes = StyleSheet.create({
    // contenido de lo escaneado
    scannedItem: {
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '80%',
        height: 85,
        alignSelf: 'center',
        borderColor:'#6A6A11',
        borderWidth:3,
        padding: 10,
        borderRadius: 5,
    },
    scannedDataText: {
        color: '#fff',
        fontSize: 18,
    },
    scannedCountText: {
        color: '#fff',
        fontSize: 18,
    },
    scrollView: {
        // marginBottom: 20,
        marginTop: 10,
    },
    // Contenedor del texto del contendio
    text: {
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20,
    }
});

// Estilos adicionales para la imagen y el texto
const stylesIMG = StyleSheet.create({
    imageContainer: {
        marginTop: 180,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        opacity: 0.6,
    },
    largeText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#AAA',

    },
});
// Estilos para el modal
const stylesModal = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#111',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color:'#fff',
        textAlign: 'center',
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#6A6A11',
        color:'#fff',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});

export default EntradaScreen;