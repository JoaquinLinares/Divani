import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, BackHandler, Animated, StyleSheet, ScrollView } from 'react-native';
import { Link, useNavigate } from 'react-router-native';
import { FontAwesome5 } from '@expo/vector-icons';
import styles from '../styles';
import MenuDesplegable from '../components/MenuDesplegable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const DocumentosScreen = () => {
    
    const [DataMovements, setDataMovements] = useState([]);
    const [filtroTipo, setFiltroTipo] = useState('todos'); // Estado para el filtro por tipo
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

    // Función para filtrar los documentos por tipo
    const handleFiltrarTipo = (tipo) => {
        setFiltroTipo(tipo);
    };

    useEffect(() => {
      async function getData() {
        const data = await AsyncStorage.getItem('movements');
        const dataParsed = data ? JSON.parse(data) : null;
        if (dataParsed) {
            // Filtra los documentos según el tipo seleccionado
            let filteredData = dataParsed.movements;
            if (filtroTipo !== 'todos') {
                filteredData = filteredData.filter(item => item.tipo === filtroTipo);
            }
            setDataMovements(filteredData);
        }
      }
      getData();
      
    }, [filtroTipo])
    
    // Función para renderizar los documentos
    const renderMovimientos = () => {
        return (
            <View style={styles.sectionContainer}>
                {/* Renderiza cada documento */}
                {DataMovements.map((documento, index) => (
                    <View key={index}>
                        {index === 0 || DataMovements[index - 1].fecha !== documento.fecha ? (
                            <Text style={stylesDocuments.fechaTitle}>{documento.fecha}</Text>
                        ) : null}
                        <View style={styles.movimientoContainer}>
                            <Text style={styles.movimientoText}>
                                {documento.producto} ({documento.cantidad}) [{documento.tipo}]
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        );
    };

    return (
        <View style={styles.mainContainer}>
            {/* NavBar de documentos */}
            <View style={styles.navbar}>
                <View style={styles.leftIcon}>
                    <Link to={'/'}>
                        <FontAwesome5 name="arrow-left" size={24} color="white" />
                    </Link>
                </View>
                <Text style={styles.centerText}>Documentos</Text>
                
                <View style={styles.rightIcon}>
                    <TouchableOpacity onPress={toggleMenu}>
                        <FontAwesome5 name='bars' size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={stylesDocuments.buttonContainer}>
                {/* Botones para filtrar por tipo */}
                <TouchableOpacity onPress={() => handleFiltrarTipo('todos')} style={[stylesDocuments.filterButton, filtroTipo === 'todos' && stylesDocuments.activeFilterButton]}>
                    <Text style={stylesDocuments.filterButtonText}>Todos</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleFiltrarTipo('entrada')} style={[stylesDocuments.filterButton, filtroTipo === 'entrada' && stylesDocuments.activeFilterButton]}>
                    <Text style={stylesDocuments.filterButtonText}>Entrada</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleFiltrarTipo('salida')} style={[stylesDocuments.filterButton, filtroTipo === 'salida' && stylesDocuments.activeFilterButton]}>
                    <Text style={stylesDocuments.filterButtonText}>Salida</Text>
                </TouchableOpacity>
            </View>
            <ScrollView>
                {/* Renderiza los documentos según el tipo seleccionado */}
                {renderMovimientos()}
            </ScrollView>
            <MenuDesplegable menuAnimation={menuAnimation} toggleMenu={toggleMenu} nombre='documentos' />
        </View>
    );
};

const stylesDocuments = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },    
    leftIcon: {
        marginLeft: 10,
    },
    centerText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    rightIcon: {
        marginRight: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    filterButton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#6A6A11',
    },
    activeFilterButton: {
        backgroundColor: 'rgba(166,166,24,0.2)',
    },
    filterButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    sectionContainer: {
        marginTop: 20,
        paddingHorizontal: 10,
    },
    fechaTitle: {
        
        color:'#fff',
        marginTop:15,
        textAlign:'center',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    movimientoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    movimientoText: {
        fontSize: 16,
    },
});

export default DocumentosScreen;
