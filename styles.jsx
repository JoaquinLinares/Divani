import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  
  mainContainer: {        
    flex: 1,
    width:'100%',
    backgroundColor: 'rgb(40, 43, 46)', // Fondo oscuro
    
  },
  sectionContainer: {
    marginTop: 10, // Espacio superior entre el navbar y las secciones
  },
  row: {
    flexDirection: 'row', // Para alinear horizontalmente los elementos
    justifyContent: 'space-evenly', // Para distribuir uniformemente los elementos en el eje principal
    marginBottom: 5, // Espacio entre filas
  },
  cameraContainer: {
    flex: 1, // Asegúrate de que el contenedor de la cámara ocupe todo el espacio disponible
    justifyContent: 'center', // O alineación 
    alignItems: 'center', // O alineación 
    
  },
  // Estilo para el ícono de cerrar la cámara
  closeIcon: {
    position: 'absolute',
    top: 40, // Ajusta la posición vertical
    right: 50, // Ajusta la posición horizontal      
    zIndex: 1, // Asegura que esté por encima de la cámara
  },
  // Estilo para el rectángulo de escaneo
  scanRect: {
    position: 'absolute',
    top: '35%', // Alinea el centro verticalmente
    left: '10%', // Ajusta la posición horizontal
    width: '80%', // Ancho del rectángulo de escaneo
    aspectRatio: 1, // Proporción de aspecto 1:1
    borderColor: 'rgba(255, 255, 255, 0.6)', // Color del borde con transparencia
    borderWidth: 3, // Ancho del borde
  },
  // Estilo para el contenedor de los datos escaneados
  scannedDataContainer: {
    position: 'absolute',
    bottom: 20, // Ajusta la posición vertical
    left: 20, // Ajusta la posición horizontal
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fondo oscuro con transparencia
    padding: 10, // Espaciado interno
    borderRadius: 5, // Borde redondeado
  },
  // Estilo para los datos escaneados
  scannedData: {
    color: '#fff', // Color blanco del texto
  },
  
});



export default styles;

