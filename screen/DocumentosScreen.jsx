import React, { useEffect, useContext, useState } from 'react';
import { Text, View, Animated, TouchableOpacity, BackHandler } from 'react-native';
import { useNavigate } from 'react-router-native';
import Constants from 'expo-constants';
import { Link } from 'react-router-native';
import { FontAwesome5 } from '@expo/vector-icons';
import MenuDesplegable from '../components/MenuDesplegable';
import styles from '../styles';
import { useContextApp } from '../components/ContextApp';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DocumentosScreen = () => {
    const history = useNavigate();
    const { movimientos, setMovimientos } = useContextApp();
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        const loadMovimientos = async () => {
            try {
                const storedMovimientos = await AsyncStorage.getItem('movimientos');
                if (storedMovimientos !== null) {
                    setMovimientos(JSON.parse(storedMovimientos));
                } else {
                    // Si no hay movimientos guardados en AsyncStorage, usamos un array vacío
                    setMovimientos([]);
                }
            } catch (error) {
                console.error('Error al cargar movimientos desde AsyncStorage:', error);
            } finally {
                setLoading(false);
            }
        };
        loadMovimientos();
    }, [setMovimientos]);

    if (loading) {
        return (
            <View style={styles.mainContainer}>
                <Text>Cargando movimientos...</Text>
            </View>
        );
    }

    return (
        <View style={styles.mainContainer}>
            <View style={[styles.navbar, { marginTop: Constants.statusBarHeight }]}>
                <View style={styles.leftIcon}>
                    <Link to={'/'}>
                        <FontAwesome5 name="arrow-left" size={24} color="white" />
                    </Link>
                </View>
                <Text style={styles.centerText}>Documentos</Text>
                <View style={styles.rightIcon}>
                    <FontAwesome5 name="file-excel" size={24} color="white" />             
                </View>
                <View style={styles.rightIcon}>
                    <TouchableOpacity onPress={toggleMenu}>
                        <FontAwesome5 name='bars' size={24} color="white" />
                    </TouchableOpacity>
                </View>          
            </View>
            <View style={styles.sectionContainer}>
                {movimientos.map((movimiento, index) => (
                    <View key={index} style={styles.movimientoContainer}>
                        {movimiento.tipo === 'entrada' && (
                            <View>
                                <Text style={styles.movimientoText}>Fecha: {movimiento.fecha}</Text>
                                <Text style={styles.movimientoText}>Producto: {movimiento.producto}</Text>
                                <Text style={styles.movimientoText}>Cantidad: {movimiento.cantidad}</Text>
                            </View>
                        )}
                    </View>
                ))}
            </View>
            <MenuDesplegable menuAnimation={menuAnimation} toggleMenu={toggleMenu} nombre='documentos' />
        </View>
    );  
}

export default DocumentosScreen;
