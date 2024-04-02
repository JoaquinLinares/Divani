import React from 'react';
import SectionSquare from './SectionSquare';
import { FontAwesome5 } from '@expo/vector-icons';

const DocumentosSection = () => {
  //  lógica para obtener el número de documentos
   // Por ejemplo
   let documentosCount = 10;
  
  return (
    <SectionSquare logo={<FontAwesome5 name="folder-open" size={24} color="white" />} title="Documentos" count={documentosCount} />
  );
};

export default DocumentosSection;
