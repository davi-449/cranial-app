/**
 * Testes para o componente NumericInput
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import NumericInput from '../src/components/NumericInput';

describe('NumericInput', () => {
  it('renders correctly', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <NumericInput 
        value="123" 
        onChangeText={onChangeText} 
        placeholder="Digite um valor" 
      />
    );
    
    const input = getByPlaceholderText('Digite um valor');
    expect(input).toBeTruthy();
    expect(input.props.value).toBe('123');
  });

  it('handles numeric input correctly', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <NumericInput 
        value="" 
        onChangeText={onChangeText} 
        placeholder="Digite um valor" 
      />
    );
    
    const input = getByPlaceholderText('Digite um valor');
    fireEvent.changeText(input, '123');
    
    expect(onChangeText).toHaveBeenCalledWith('123');
  });

  it('filters non-numeric characters', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <NumericInput 
        value="" 
        onChangeText={onChangeText} 
        placeholder="Digite um valor" 
      />
    );
    
    const input = getByPlaceholderText('Digite um valor');
    fireEvent.changeText(input, '123abc');
    
    expect(onChangeText).toHaveBeenCalledWith('123');
  });

  it('allows decimal points', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <NumericInput 
        value="" 
        onChangeText={onChangeText} 
        placeholder="Digite um valor" 
      />
    );
    
    const input = getByPlaceholderText('Digite um valor');
    fireEvent.changeText(input, '123.45');
    
    expect(onChangeText).toHaveBeenCalledWith('123.45');
  });

  it('prevents multiple decimal points', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <NumericInput 
        value="" 
        onChangeText={onChangeText} 
        placeholder="Digite um valor" 
      />
    );
    
    const input = getByPlaceholderText('Digite um valor');
    fireEvent.changeText(input, '123.45.67');
    
    expect(onChangeText).toHaveBeenCalledWith('123.4567');
  });

  it('displays suffix when provided', () => {
    const onChangeText = jest.fn();
    const { getByText } = render(
      <NumericInput 
        value="123" 
        onChangeText={onChangeText} 
        placeholder="Digite um valor"
        suffix="mm" 
      />
    );
    
    expect(getByText('mm')).toBeTruthy();
  });

  it('applies error styling when error is true', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <NumericInput 
        value="123" 
        onChangeText={onChangeText} 
        placeholder="Digite um valor"
        error={true}
      />
    );
    
    const input = getByPlaceholderText('Digite um valor');
    const inputContainer = input.parent.parent;
    
    // Verificar se a classe de estilo de erro foi aplicada
    expect(inputContainer.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ borderColor: '#d32f2f' })
      ])
    );
  });
});
