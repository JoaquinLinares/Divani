import React, { useEffect, useState } from 'react';
import { Text, View, Animated, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native';
import { BackHandler } from 'react-native';
import { useNavigate } from 'react-router-native';
import Constants from 'expo-constants';
import { FontAwesome5 } from '@expo/vector-icons';
import MenuDesplegable from '../components/MenuDesplegable';
import styles from '../styles';
import { addAllItems, deleteAllItems } from '../services/async-storage-write';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllItems } from '../services/async-storage-read';

const PedidosScreen = () => {
    const history = useNavigate();
    const [cliente, setCliente] = useState('');
    const [direccion, setDireccion] = useState('');
    const [expreso, setExpreso] = useState(false);
    const [dia, setDia] = useState('');

    useEffect(() => {
        const backAction = () => {
            history('/'); // Navega de vuelta a la pantalla de inicio (HomeScreen)
            return true; // Evita que la aplicación se cierre al presionar el botón de retroceso
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => backHandler.remove();
    }, [history]);

    // Menu desplegable
    const menuAnimation = new Animated.Value(0); // Valor inicial fuera de la pantalla

    const toggleMenu = () => {
        const toValue = menuAnimation._value === -250 ? 0 : -250; // Determina el nuevo valor de la animación
        Animated.spring(menuAnimation, {
            toValue,
            useNativeDriver: false, // Necesario para que funcione en Android
        }).start();
    };

    const renderCabeceraTabla = () => ( 
        <View style={styles.cabeceraTabla}>
            <View style={styles.tituloFila}>
                <Text style={styles.cabeceraTitulo}>Artículo</Text>
                <Text style={styles.cabeceraTitulo}>Color</Text>
                <Text style={styles.cabeceraTitulo}>Tareas</Text>
            </View>
            <ScrollView horizontal={true}>
                <View style={styles.filaNumeros}>
                    {Array.from({ length: 45 - 27 + 1 }, (_, i) => i + 27).map(numero =>
                        <Text style={styles.numeroColumna} key={numero}>{numero}</Text>
                    )}
                </View>
            </ScrollView>
        </View>
    );

    const renderFilaTabla = () => (
        <View style={styles.filaTabla}>
            <TextInput style={styles.inputTabla} />
            <TextInput style={styles.inputTabla} />
            <TextInput style={styles.inputTabla} />
            {Array.from({ length: 45 - 27 + 1 }, (_, i) => i + 27).map(numero =>
                <TextInput style={styles.inputTabla} key={numero} />
            )}
        </View>
    );

    const renderTabla = () => (
        <ScrollView horizontal={true}>
            <View style={styles.tabla}>
                {renderCabeceraTabla()}
                {renderFilaTabla()}
            </View>
        </ScrollView>
    );

    return (
        <View style={styles.mainContainer}>
            {/* NavBar de Pedidos */}
            <View style={[styles.navbar, { marginTop: Constants.statusBarHeight }]}>
                <View style={styles.leftIcon}>
                    {/* Logo de DIVANI */}
                    <TouchableOpacity onPress={toggleMenu}>
                        <FontAwesome5 name='bars' size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.centerText}>Pedidos</Text>
                <View style={styles.rightIcon}>
                    {/* Icono del Excel */}
                    <FontAwesome5 name="file-excel" size={24} color="white" />
                </View>
            </View>

            {/* Sección de información del pedido */}
            <View style={styles.infoPedido}>
                <View style={styles.clienteDireccion}>
                    <View style={styles.clienteContainer}>
                        <Text style={styles.label}>Cliente:</Text>
                        <TextInput
                            style={[styles.input, { height: 30 }]} // Ajuste de altura
                            value={cliente}
                            onChangeText={setCliente}
                        />
                    </View>
                    <View style={styles.direccionContainer}>
                        <Text style={styles.label}>Dirección:</Text>
                        <TextInput
                            style={[styles.input, { height: 30 }]} // Ajuste de altura
                            value={direccion}
                            onChangeText={setDireccion}
                        />
                    </View>
                </View>
                <View style={styles.expresoDia}>
                    <View style={styles.expresoContainer}>
                        <Text style={styles.label}>Expreso:</Text>
                        <TouchableOpacity onPress={() => setExpreso(!expreso)}>
                            <FontAwesome5 name={expreso ? 'check-square' : 'square'} size={24} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.diaContainer}>
                        <Text style={styles.label}>Día:</Text>
                        <TextInput
                            style={[styles.input, { height: 30 }]} // Ajuste de altura
                            value={dia}
                            onChangeText={setDia}
                        />
                    </View>
                </View>
            </View>

            {/* Tabla de pedidos */}
            <View style={styles.tablaContainer}>
                {renderTabla()}
            </View>

            {/* Menu desplegable */}
            <MenuDesplegable menuAnimation={menuAnimation} toggleMenu={toggleMenu} nombre='pedidos' />
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#333',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    leftIcon: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    centerText: {
        color: 'white',
        fontSize: 20,
    },
    rightIcon: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoPedido: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1, // Borde inferior
        borderBottomColor: '#ccc', // Color del borde inferior
    },
    clienteDireccion: {
        flex: 1,
    },
    clienteContainer: {
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    direccionContainer: {
        marginBottom: 10,
    },
    expresoDia: {
        flex: 1,
    },
    expresoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    diaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
    },
    tablaContainer: {
        flex: 1,
    },
    tabla: {
        flexDirection: 'row',
    },
    cabeceraTabla: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#f0f0f0',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    tituloFila: {
        flexDirection: 'row',
        marginRight: 20,
    },
    cabeceraTitulo: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    filaTabla: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    numeroColumna: {
        flex: 1,
        textAlign: 'center',
    },
    inputTabla: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 5,
    },
});

export default PedidosScreen;
