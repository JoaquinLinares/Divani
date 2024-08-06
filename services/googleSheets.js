const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby7h3bMHHN9pc8dYSGJUwHdw7K3Kw3BJ3A182XMCw_sZXejTprrG7q-0zNMA5H5LCT3/exec'; // Reemplaza con la URL correcta
import { getAllItems } from '../services/async-storage/async-storage-read'; 

const fetchData = async () => {
  try {
    const data = await getAllItems();
    return data;
  } catch (error) {
    console.error('Error fetching data from AsyncStorage:', error);
    throw error;
  }
};

export const updateSheet = async () => {
  const data = await fetchData();

  // Crear un array para almacenar los datos formateados
  const formattedData = data.map(item => [
    item.articulo,
    item.color,
    item.talle,
    item.stock
  ]);

  console.log('Formatted Data:', formattedData); // Verifica el formato de los datos

  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: formattedData }), // Enviar datos en el formato requerido
    });

    // Verificar si la respuesta fue exitosa
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const text = await response.text();
    try {
      const result = JSON.parse(text);
      if (result.result !== 'success') {
        throw new Error('Error updating sheet');
      }
      console.log('Data updated successfully!');
    } catch (error) {
      console.error('Error parsing response:', text);
      throw new Error('Error parsing response');
    }
  } catch (error) {
    console.error('Error updating the sheet:', error);
    throw error;
  }
};
