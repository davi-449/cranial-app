import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  TextInput,
  Switch,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

const UserProfileScreen: React.FC = () => {
  const { user, signOut, updateUserProfile, toggleDarkMode, loading } = useAuth();
  const navigation = useNavigation();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [function_, setFunction] = useState(user?.function || '');
  const [clinic, setClinic] = useState(user?.clinic || '');
  const [isDarkMode, setIsDarkMode] = useState(user?.darkMode || false);
  
  const handleSaveProfile = async () => {
    try {
      await updateUserProfile({
        name,
        email,
        function: function_,
        clinic
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    }
  };
  
  const handleToggleDarkMode = async () => {
    setIsDarkMode(!isDarkMode);
    await toggleDarkMode();
  };
  
  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Sair',
          onPress: signOut
        }
      ]
    );
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1E88E5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
        {!isEditing ? (
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Ionicons name="create-outline" size={24} color="#1E88E5" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSaveProfile}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#1E88E5" />
            ) : (
              <Ionicons name="checkmark" size={24} color="#1E88E5" />
            )}
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.profileImageContainer}>
        <Image 
          source={user?.profileImage ? { uri: user.profileImage } : require('../assets/default-profile.png')} 
          style={styles.profileImage}
        />
        {isEditing && (
          <TouchableOpacity style={styles.changePhotoButton}>
            <Text style={styles.changePhotoText}>Alterar foto</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Nome</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Seu nome completo"
            />
          ) : (
            <Text style={styles.infoValue}>{user?.name || 'Não informado'}</Text>
          )}
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Usuário</Text>
          <Text style={styles.infoValue}>{user?.username}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>E-mail</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Seu e-mail"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          ) : (
            <Text style={styles.infoValue}>{user?.email || 'Não informado'}</Text>
          )}
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Função</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={function_}
              onChangeText={setFunction}
              placeholder="Sua função (ex: Fisioterapeuta, Pediatra)"
            />
          ) : (
            <Text style={styles.infoValue}>{user?.function || 'Não informado'}</Text>
          )}
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Clínica</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={clinic}
              onChangeText={setClinic}
              placeholder="Nome da sua clínica"
            />
          ) : (
            <Text style={styles.infoValue}>{user?.clinic || 'Não informado'}</Text>
          )}
        </View>
        
        <View style={styles.switchItem}>
          <Text style={styles.switchLabel}>Modo escuro</Text>
          <Switch
            trackColor={{ false: "#BBDEFB", true: "#64B5F6" }}
            thumbColor={isDarkMode ? "#1E88E5" : "#f4f3f4"}
            ios_backgroundColor="#BBDEFB"
            onValueChange={handleToggleDarkMode}
            value={isDarkMode}
          />
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E88E5',
  },
  editButton: {
    padding: 8,
  },
  saveButton: {
    padding: 8,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e0e0e0',
  },
  changePhotoButton: {
    marginTop: 10,
  },
  changePhotoText: {
    color: '#1E88E5',
    fontSize: 14,
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoItem: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#212121',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
    color: '#212121',
  },
  switchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: '#212121',
  },
  logoutButton: {
    backgroundColor: '#F44336',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    margin: 16,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default UserProfileScreen;
