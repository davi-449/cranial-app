import React from 'react';
import { View, StyleSheet } from 'react-native';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme, VictoryLegend } from 'victory-native';

interface TimelineChartProps {
  data: {
    dates: string[];
    ciValues: number[];
    cvaiValues: number[];
  };
  width?: number;
  height?: number;
}

const TimelineChart: React.FC<TimelineChartProps> = ({
  data,
  width = 350,
  height = 250
}) => {
  // Formatar dados para o gráfico
  const formatData = (values: number[], dates: string[]) => {
    return values.map((value, index) => ({
      x: new Date(dates[index]),
      y: value
    }));
  };

  const ciData = formatData(data.ciValues, data.dates);
  const cvaiData = formatData(data.cvaiValues, data.dates);

  // Formatador de data para o eixo X
  const formatDate = (date: Date) => {
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  return (
    <View style={styles.container}>
      <VictoryChart
        width={width}
        height={height}
        theme={VictoryTheme.material}
        scale={{ x: 'time' }}
        domainPadding={{ y: 10 }}
      >
        <VictoryLegend
          x={50}
          y={10}
          orientation="horizontal"
          gutter={20}
          data={[
            { name: 'Índice Craniano (CI)', symbol: { fill: '#c43a31' } },
            { name: 'CVAI', symbol: { fill: '#1f77b4' } }
          ]}
        />
        <VictoryAxis
          tickFormat={formatDate}
          style={{
            tickLabels: { fontSize: 10, padding: 5 }
          }}
        />
        <VictoryAxis
          dependentAxis
          style={{
            tickLabels: { fontSize: 10, padding: 5 }
          }}
        />
        <VictoryLine
          data={ciData}
          style={{
            data: { stroke: '#c43a31', strokeWidth: 2 }
          }}
          animate={{
            duration: 500,
            onLoad: { duration: 500 }
          }}
        />
        <VictoryLine
          data={cvaiData}
          style={{
            data: { stroke: '#1f77b4', strokeWidth: 2 }
          }}
          animate={{
            duration: 500,
            onLoad: { duration: 500 }
          }}
        />
      </VictoryChart>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  }
});

export default TimelineChart;
