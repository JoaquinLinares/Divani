import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllItems } from "./async-storage-read";
import dbData from "../db/divani_db.json"; // Importar los datos del archivo JSON

// Método para agregar un nuevo elemento
export const addItem = async (newItem) => {
    try {
      let data = await getAllItems();
      data.push(newItem);
      await AsyncStorage.setItem('db', JSON.stringify(data));
      console.log("Item agregado:", newItem);
    } catch (e) {
      console.error("Error al agregar item:", e);
    }
  };

  // Método para agregar todos los elementos
export const addAllItems = async () => {
    try {
        await AsyncStorage.setItem('db', JSON.stringify(dbData)); // Guarda todos los elementos en AsyncStorage
        console.log("Todos los elementos agregados correctamente");
    } catch (error) {
        console.error("Error al agregar todos los elementos:", error);
    }
};

  
  // Método para actualizar un elemento existente
  export const updateItem = async (id, updatedItem) => {
    try {
      let data = await getAllItems();
      const index = data.findIndex(item => item.id === id);
      if (index !== -1) {
        data[index] = updatedItem;
        await AsyncStorage.setItem('db', JSON.stringify(data));
        console.log("Item actualizado:", updatedItem);
      } else {
        console.warn("no se encontro el item:", id);
      }
    } catch (e) {
      console.error("Error al actualizar:", e);
    }
  };

  
// Método para actualizar un elemento por su ID
export const updateItemById = async (id, newData) => {
  try {
    let data = await getAllItems(); // Obtener todos los elementos de AsyncStorage
    const newDataIndex = data.findIndex(item => item.id === id); // Encontrar el índice del elemento a actualizar
    if (newDataIndex !== -1) {
      data[newDataIndex] = { ...data[newDataIndex], ...newData }; // Actualizar el elemento con los nuevos datos
      await AsyncStorage.setItem('db', JSON.stringify(data)); // Guardar los datos actualizados
      console.log("Item actualizado:", newData);
    } else {
      console.warn("No se encontró el item:", id);
    }
  } catch (error) {
    console.error('Error al actualizar el artículo:', error);
  }
};

  
  // Método para eliminar un elemento por su ID
  export const deleteItemById = async (id) => {
    try {
      let data = await getAllItems();
      const filteredData = data.filter(item => item.id !== id);
      await AsyncStorage.setItem('db', JSON.stringify(filteredData));
      console.log("Item eliminado:", id);
    } catch (e) {
      console.error("Error al eliminar:", e);
    }
  };

// Método para eliminar todos los elementos
export const deleteAllItems = async () => {
  try {
      await AsyncStorage.removeItem('db'); // Elimina la clave 'db' que contiene todos los elementos
      console.log("Todos los elementos eliminados");
  } catch (error) {
      console.error("Error al eliminar todos los elementos:", error);
  }
};
