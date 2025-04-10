/**
 * Testes para o componente TimelineChart
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import TimelineChart from '../src/components/TimelineChart';

// Mock do Victory Native
jest.mock('victory-native', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  
  const MockVictoryChart = ({ children }) => (
    <View testID="victory-chart">{children}</View>
  );
  
  const MockVictoryLine = () => <View testID="victory-line" />;
  
  const MockVictoryAxis = () => <View testID="victory-axis" />;
  
  const MockVictoryLegend = () => <View testID="victory-legend" />;
  
  return {
    VictoryChart: MockVictoryChart,
    VictoryLine: MockVictoryLine,
    VictoryAxis: MockVictoryAxis,
    VictoryLegend: MockVictoryLegend,
    VictoryTheme: { material: {} }
  };
});

describe('TimelineChart', () => {
  const mockData = {
    dates: ['2023-01-01', '2023-02-01', '2023-03-01'],
    ciValues: [75.5, 76.2, 77.8],
    cvaiValues: [6.2, 5.8, 5.1]
  };

  it('renders correctly with data', () => {
    const { getByTestId, getAllByTestId } = render(
      <TimelineChart data={mockData} />
    );
    
    // Verificar se o gráfico foi renderizado
    expect(getByTestId('victory-chart')).toBeTruthy();
    
    // Verificar se as linhas do gráfico foram renderizadas (uma para CI e outra para CVAI)
    expect(getAllByTestId('victory-line').length).toBe(2);
    
    // Verificar se os eixos foram renderizados
    expect(getAllByTestId('victory-axis').length).toBe(2);
    
    // Verificar se a legenda foi renderizada
    expect(getByTestId('victory-legend')).toBeTruthy();
  });

  it('renders with custom dimensions', () => {
    const { getByTestId } = render(
      <TimelineChart data={mockData} width={400} height={300} />
    );
    
    // Verificar se o gráfico foi renderizado
    expect(getByTestId('victory-chart')).toBeTruthy();
  });

  it('handles empty data gracefully', () => {
    const emptyData = {
      dates: [],
      ciValues: [],
      cvaiValues: []
    };
    
    const { getByTestId } = render(
      <TimelineChart data={emptyData} />
    );
    
    // Verificar se o gráfico ainda é renderizado mesmo com dados vazios
    expect(getByTestId('victory-chart')).toBeTruthy();
  });
});
