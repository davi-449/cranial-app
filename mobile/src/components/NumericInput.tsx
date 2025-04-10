import React from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  Text,
  TouchableOpacity
} from 'react-native';

interface NumericInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: boolean;
  suffix?: string;
  maxLength?: number;
  editable?: boolean;
}

const NumericInput: React.FC<NumericInputProps> = ({
  value,
  onChangeText,
  placeholder = '0',
  error = false,
  suffix,
  maxLength = 6,
  editable = true
}) => {
  // Função para formatar o valor como numérico
  const handleChangeText = (text: string) => {
    // Remove qualquer caractere que não seja número ou ponto
    const numericValue = text.replace(/[^0-9.]/g, '');
    
    // Garante que só exista um ponto decimal
    const parts = numericValue.split('.');
    const formattedValue = parts.length > 1 
      ? `${parts[0]}.${parts.slice(1).join('')}`
      : numericValue;
    
    onChangeText(formattedValue);
  };

  return (
    <View style={styles.container}>
      <View style={[
        styles.inputContainer,
        error && styles.inputError
      ]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          keyboardType="numeric"
          maxLength={maxLength}
          editable={editable}
        />
        {suffix && (
          <Text style={styles.suffix}>{suffix}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#d32f2f',
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  suffix: {
    paddingRight: 10,
    color: '#757575',
    fontSize: 14,
  }
});

export default NumericInput;
