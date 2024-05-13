import React from 'react';
import SectionSquare from './SectionSquare';
import { FontAwesome5 } from '@expo/vector-icons';

const ModoSection = () => {
   
  
  return (
    <SectionSquare logo={<FontAwesome5 name="question" size={24} color="white" />} title="Proximamente" />
  );
};

export default ModoSection;
