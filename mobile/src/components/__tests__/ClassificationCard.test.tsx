/**
 * Testes para o componente ClassificationCard
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import ClassificationCard from '../src/components/ClassificationCard';

describe('ClassificationCard', () => {
  it('renders correctly with normal classification', () => {
    const { getByText } = render(
      <ClassificationCard 
        title="Índice Craniano (CI)"
        value={80.5}
        classification="Normal"
      />
    );
    
    expect(getByText('Índice Craniano (CI)')).toBeTruthy();
    expect(getByText('80.50')).toBeTruthy();
    expect(getByText('Normal')).toBeTruthy();
  });

  it('renders correctly with plagiocephaly classification', () => {
    const { getByText } = render(
      <ClassificationCard 
        title="CVAI"
        value={8.2}
        classification="Plagiocefalia Grave"
        unit="%"
      />
    );
    
    expect(getByText('CVAI')).toBeTruthy();
    expect(getByText('8.20%')).toBeTruthy();
    expect(getByText('Plagiocefalia Grave')).toBeTruthy();
  });

  it('applies correct color for normal classification', () => {
    const { getByText } = render(
      <ClassificationCard 
        title="Índice Craniano (CI)"
        value={80.5}
        classification="Normal"
      />
    );
    
    const classificationElement = getByText('Normal');
    const classificationContainer = classificationElement.parent;
    
    // Verificar se a cor de fundo correta foi aplicada
    expect(classificationContainer.props.style).toEqual(
      expect.objectContaining({ backgroundColor: '#4caf50' })
    );
  });

  it('applies correct color for plagiocephaly classification', () => {
    const { getByText } = render(
      <ClassificationCard 
        title="CVAI"
        value={8.2}
        classification="Plagiocefalia Grave"
      />
    );
    
    const classificationElement = getByText('Plagiocefalia Grave');
    const classificationContainer = classificationElement.parent;
    
    // Verificar se a cor de fundo correta foi aplicada
    expect(classificationContainer.props.style).toEqual(
      expect.objectContaining({ backgroundColor: '#d32f2f' })
    );
  });

  it('displays unit when provided', () => {
    const { getByText } = render(
      <ClassificationCard 
        title="CVAI"
        value={8.2}
        classification="Plagiocefalia Grave"
        unit="%"
      />
    );
    
    expect(getByText('8.20%')).toBeTruthy();
  });
});
