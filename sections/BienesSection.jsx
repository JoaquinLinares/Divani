import React from 'react';
import SectionSquare from './SectionSquare';
import { FontAwesome5 } from '@expo/vector-icons';

const BienesSection = () => {  
  return (
    <SectionSquare logo={<FontAwesome5 name="dolly" size={24} color="white" />} title="Bienes"  />
  );
};

export default BienesSection;
