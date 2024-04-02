import React from 'react';
import SectionSquare from './SectionSquare';
import { FontAwesome5 } from '@expo/vector-icons';

const PedidosSection = () => {
   
  
  return (
    <SectionSquare logo={<FontAwesome5 name="pen-nib" size={24} color="white" />} title="Pedidos" />
  );
};

export default PedidosSection;
