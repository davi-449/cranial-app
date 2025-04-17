import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Telas
import LoginScreen from '../screens/LoginScreen';
import PatientListScreen from '../screens/PatientListScreen';
import PatientFormScreen from '../screens/PatientFormScreen';
import MeasurementFormScreen from '../screens/MeasurementFormScreen';
import ReportScreen from '../screens/ReportScreen';
import EvolutionScreen from '../screens/EvolutionScreen';
import ProgressChartScreen from '../screens/ProgressChartScreen';
import VirtualAssistantScreen from '../screens/VirtualAssistantScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import ClinicRegistrationScreen from '../screens/ClinicRegistrationScreen';

// Contextos
import { useAuth } from '../contexts/AuthContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Navegador de abas para a aplicação principal
const AppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Pacientes') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Medições') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'Relatórios') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Assistente') {
            iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1E88E5',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Pacientes" component={PatientsStack} />
      <Tab.Screen name="Medições" component={MeasurementsStack} />
      <Tab.Screen name="Relatórios" component={ReportsStack} />
      <Tab.Screen name="Assistente" component={VirtualAssistantScreen} />
      <Tab.Screen name="Perfil" component={ProfileStack} />
    </Tab.Navigator>
  );
};

// Stack para gerenciamento de pacientes
const PatientsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1E88E5',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="PatientList" 
        component={PatientListScreen} 
        options={{ title: 'Lista de Pacientes' }} 
      />
      <Stack.Screen 
        name="PatientForm" 
        component={PatientFormScreen} 
        options={{ title: 'Cadastro de Paciente' }} 
      />
    </Stack.Navigator>
  );
};

// Stack para medições
const MeasurementsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1E88E5',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="MeasurementForm" 
        component={MeasurementFormScreen} 
        options={{ title: 'Nova Medição' }} 
      />
    </Stack.Navigator>
  );
};

// Stack para relatórios
const ReportsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1E88E5',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
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
      <Stack.Screen 
        name="ProgressChart" 
        component={ProgressChartScreen} 
        options={{ title: 'Gráficos de Progresso' }} 
      />
    </Stack.Navigator>
  );
};

// Stack para perfil e configurações
const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1E88E5',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="UserProfile" 
        component={UserProfileScreen} 
      />
      <Stack.Screen 
        name="ClinicRegistration" 
        component={ClinicRegistrationScreen} 
        options={{ title: 'Cadastro de Clínica' }} 
      />
    </Stack.Navigator>
  );
};

// Navegador principal que decide entre autenticação e aplicação
// Corrigido para incluir as stacks de navegação como telas registradas
const AppNavigator = () => {
  const { signed, loading } = useAuth();

  if (loading) {
    return null; // Ou um componente de loading
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {signed ? (
        <>
          <Stack.Screen name="App" component={AppTabs} />
          {/* Registrar as stacks de navegação no navegador principal para permitir navegação hierárquica */}
          <Stack.Screen name="PatientStack" component={PatientsStack} />
          <Stack.Screen name="MeasurementStack" component={MeasurementsStack} />
          <Stack.Screen name="ReportStack" component={ReportsStack} />
          <Stack.Screen name="ProfileStack" component={ProfileStack} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
