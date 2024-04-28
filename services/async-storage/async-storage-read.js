import AsyncStorage from "@react-native-async-storage/async-storage";

// Metodo para obtener un elemento por su ID


export const getItemById = async (articulo) => {
  try {
    const jsonValue = await AsyncStorage.getItem('db');
    const data = jsonValue != null ? JSON.parse(jsonValue) : [];
    const articles = data.filter(item => item.articulo.toString() === articulo);
    
    if (articles.length > 0) {
      return articles;
    } else {
      console.error("Artículo no encontrado:", articulo);
      return null;
    }
  } catch (e) {
    console.error("Error:", e);
    return null;
  }
};





// Método para obtener todos los elementos
export const getAllItems = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('db');
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Error:", e);
    return [];
  }
};


