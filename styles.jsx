import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // Contenido
  mainContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgb(40, 43, 46)',
  },
  sectionContainer: {
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 5,
  },
  // 
  // Camara
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    position: 'absolute',
    top: 50,
    right: 50,
    zIndex: 1,
  },
  flashButton:{
    position: 'absolute',
    top: 50,
    left: 50,
    zIndex: 1,
  },
  // 
  // Mensaje de escaneo
  scanRect: {
    position: 'absolute',
    top: '35%',
    left: '10%',
    width: '80%',
    aspectRatio: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 3,
  },
  scanRectContainer: {
    position: 'absolute',
    top: '50%', // Cambiado a la mitad de la pantalla verticalmente
    left: '10%',
    width: '80%',
    alignItems: 'center', // Centrado horizontalmente
    backgroundColor: '#045834', // Verde claro con opacidad
    padding: 25, // Padding agregado para un aspecto más prolijo
    borderRadius: 10, // Borde redondeado
  },
  text: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center', // Centrado horizontalmente
  },
  // 
  // Estilos para el NavBar de los screen
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgb(20, 23, 26)',
    paddingVertical: 20,
    paddingHorizontal: 15,    
    width: '100%',
  },
  leftIcon: {    
    marginLeft: 10,
  },
  centerText: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
  },
  centerTextStock: {
    paddingRight:70,
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  rightIcon: {
    marginRight: 2,
  },
  movimientoText:{
    fontSize:18,
    color:'#fff',
    textAlign:'center',
    margin:10,
  },
  divaniText: {
    color: 'white',
    fontSize: 18,
},
sectionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
},
input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    marginBottom: 10,
},
expresoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
},
tabla: {
    flexDirection: 'row',
},
tablaContent: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 20,
},
cabeceraTabla: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
},
cabeceraTitulo: {
    flex: 1,
    fontWeight: 'bold',
},
filaTabla: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
},
numeroFila: {
    flex: 1,
},
inputTabla: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
},
});

export default styles;