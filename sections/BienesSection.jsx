import React from 'react';
import SectionSquare from './SectionSquare';
import { FontAwesome5 } from '@expo/vector-icons';

const BienesSection = () => {
  // lógica para obtener el número de bienes
  const bienesCount = 10; // Por ejemplo
  
  return (
    <SectionSquare logo={<FontAwesome5 name="dolly" size={24} color="white" />} title="Bienes" count={bienesCount} />
  );
};

export default BienesSection;
