import React from 'react';
import SectionSquare from './SectionSquare';
import { FontAwesome5 } from '@expo/vector-icons';

const DocumentosSection = () => {  
  return (
    <SectionSquare logo={<FontAwesome5 name="folder-open" size={24} color="white" />} title="Documentos"  />
  );
};

export default DocumentosSection;
