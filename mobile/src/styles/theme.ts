import React from 'react';
import { StyleSheet } from 'react-native';

// Nova paleta de cores em tons de azul conforme solicitado
export const Colors = {
  primary: '#1E88E5',      // Azul principal
  primaryLight: '#64B5F6', // Azul claro
  primaryLighter: '#BBDEFB', // Azul mais claro
  
  // Cores complementares
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FFC107',
  info: '#2196F3',
  
  // Tons de cinza
  text: '#212121',
  textSecondary: '#757575',
  divider: '#BDBDBD',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  
  // Cores para modo escuro
  darkPrimary: '#1565C0',
  darkBackground: '#121212',
  darkSurface: '#1E1E1E',
  darkText: '#FFFFFF',
  darkTextSecondary: '#B0B0B0',
};

// Estilos comuns para reutilização em toda a aplicação
export const CommonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // Cabeçalhos
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  
  // Cartões e contêineres
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  // Formulários
  formContainer: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    color: Colors.text,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  
  // Botões
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: Colors.primaryLighter,
  },
  
  // Feedback
  successMessage: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: Colors.success,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  successMessageText: {
    color: '#2E7D32',
    fontSize: 16,
    textAlign: 'center',
  },
  
  // Listas
  listItem: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  // Texto
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: Colors.textSecondary,
  },
  
  // Ícones e badges
  iconButton: {
    padding: 8,
  },
  badge: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: Colors.surface,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

// Tema para modo escuro
export const DarkTheme = {
  colors: {
    ...Colors,
    primary: Colors.darkPrimary,
    background: Colors.darkBackground,
    surface: Colors.darkSurface,
    text: Colors.darkText,
    textSecondary: Colors.darkTextSecondary,
  },
  styles: {
    ...CommonStyles,
    container: {
      ...CommonStyles.container,
      backgroundColor: Colors.darkBackground,
    },
    card: {
      ...CommonStyles.card,
      backgroundColor: Colors.darkSurface,
    },
    header: {
      ...CommonStyles.header,
      backgroundColor: Colors.darkSurface,
      borderBottomColor: '#333333',
    },
    input: {
      ...CommonStyles.input,
      backgroundColor: '#333333',
      borderColor: '#555555',
      color: Colors.darkText,
    },
  },
};

export default {
  Colors,
  CommonStyles,
  DarkTheme,
};
