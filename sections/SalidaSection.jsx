import React from 'react';
import SectionSquare from './SectionSquare';
import { FontAwesome5 } from '@expo/vector-icons';

const SalidaSection = () => {
   
  
  return (
    <SectionSquare logo={<FontAwesome5 name="folder-minus" size={24} color="white" />} title="Salida" />
  );
};

export default SalidaSection;
