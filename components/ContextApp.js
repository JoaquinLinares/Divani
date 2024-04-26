import React, { createContext, useState, useContext } from 'react';

// Creamos el contexto
const ContextApp = createContext();

// Creamos el provider
export const ContextAppProvider = ({ children }) => {
  const [movimientos, setMovimientos] = useState([]);

  // Función para agregar un movimiento
  const agregarMovimiento = (movimiento) => {
    setMovimientos([...movimientos, movimiento]);
  };

  // Retornamos el contexto y las funciones que necesitamos utilizar
  return (
    <ContextApp.Provider value={{ movimientos, agregarMovimiento }}>
      {children}
    </ContextApp.Provider>
  );
};

// Hook personalizado para utilizar el contexto
export const useContextApp = () => useContext(ContextApp);
