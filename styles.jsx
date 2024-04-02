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
});



export default styles;

