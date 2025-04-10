import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MeasurementFormScreen from '../screens/MeasurementFormScreen';
import PatientListScreen from '../screens/PatientListScreen';
import ReportScreen from '../screens/ReportScreen';
import EvolutionScreen from '../screens/EvolutionScreen';
import type { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

const MainStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="MeasurementForm"
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#6200ee' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="MeasurementForm"
        component={MeasurementFormScreen}
        options={{ title: 'Nova Medição' }}
      />
      <Stack.Screen
        name="PatientList"
        component={PatientListScreen}
        options={{ title: 'Lista de Pacientes' }}
      />
      <Stack.Screen
        name="Report"
        component={ReportScreen}
        options={{ title: 'Relatório' }}
      />
      <Stack.Screen
        name="Evolution"
        component={EvolutionScreen}
        options={{ title: 'Evolução' }}
      />
    </Stack.Navigator>
  );
};

export default MainStack;