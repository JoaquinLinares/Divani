import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAllItems } from "./async-storage-read";

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