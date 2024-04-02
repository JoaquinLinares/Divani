import React from 'react';
import SectionSquare from './SectionSquare';
import { FontAwesome5 } from '@expo/vector-icons';

const EntradaSection = () => {
   
  
  return (
    <SectionSquare logo={<FontAwesome5 name="folder-plus" size={24} color="white" />} title="Entrada" />
  );
};

export default EntradaSection;
