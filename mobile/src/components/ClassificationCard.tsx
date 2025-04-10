import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet 
} from 'react-native';

interface ClassificationCardProps {
  title: string;
  value: number;
  classification: string;
  unit?: string;
}

const ClassificationCard: React.FC<ClassificationCardProps> = ({
  title,
  value,
  classification,
  unit = ''
}) => {
  // Determinar a cor com base na classificação
  const getColorByClassification = (classification: string): string => {
    switch (classification) {
      case 'Plagiocefalia Grave':
        return '#d32f2f'; // Vermelho
      case 'Dolicocefalia':
        return '#ff9800'; // Laranja
      case 'Braquicefalia':
        return '#ff9800'; // Laranja
      case 'Normal':
        return '#4caf50'; // Verde
      default:
        return '#757575'; // Cinza
    }
  };

  const backgroundColor = getColorByClassification(classification);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.value}>
          {value.toFixed(2)}{unit}
        </Text>
        <View style={[styles.classificationContainer, { backgroundColor }]}>
          <Text style={styles.classification}>{classification}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
  },
  content: {
    padding: 16,
    alignItems: 'center',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  classificationContainer: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginTop: 8,
  },
  classification: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  }
});

export default ClassificationCard;
