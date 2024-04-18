import AsyncStorage from "@react-native-async-storage/async-storage";

// Metodo para obtener un elemento por su ID
export const getItemById = async (id) => {
  try {
    const jsonValue = await AsyncStorage.getItem('db');
    const data = jsonValue != null ? JSON.parse(jsonValue) : [];
    return data.find(item => item.id === id);
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


