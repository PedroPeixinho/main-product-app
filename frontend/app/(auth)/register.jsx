import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [crfa, setCrfa] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);


  const handleRegister = async () => {
    setErrorMessage('');
    setLoading(true);
  
    if (senha !== confirmarSenha) {
      setErrorMessage('As senhas não coincidem.');
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/auth/fono/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, cpf, crfa, email, senha }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar conta');
      }
  
      // Store token and navigate to home
      await AsyncStorage.setItem("token", data.token);
      router.push('../(tabs)/home');  // MUDAR ROTA
  
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Ocorreu um erro desconhecido.');
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Logo */}
      <Image source={require('../../assets/images/Logo final.png')} style={styles.logo} />

      <Text style={styles.subtitle}>Profissional</Text>
      <Text style={styles.title}>Crie uma conta</Text>

      {/* Nome */}
      <Text style={styles.label}>Nome</Text>
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input}
          placeholder="Seu primeiro nome"
          placeholderTextColor="#aaa"
          value={nome}
          onChangeText={setNome}
        />
      </View>

      {/* Sobrenome */}
      <Text style={styles.label}>CPF</Text>
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Insira seu CPF (somente números)" 
          placeholderTextColor="#aaa"
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
          maxLength={11}
        />
      </View>

      {/* CRFa */}
      <Text style={styles.label}>CRFa</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Insira seu CRFa"
          placeholderTextColor="#aaa"
          value={crfa}
          onChangeText={setCrfa}
        />
      </View>

      {/* E-mail */}
      <Text style={styles.label}>E-mail</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Informe um e-mail válido"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <Text style={styles.infoText}>Você utilizará esse e-mail para entrar</Text>

      {/* Senha */}
      <Text style={styles.label}>Senha</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Insira uma senha forte"
          placeholderTextColor="#aaa"
          secureTextEntry={!passwordVisible}
          value={senha}
          onChangeText={setSenha}
        />
        <TouchableOpacity style={styles.eyeIcon} onPress={() => setPasswordVisible(!passwordVisible)}>
          <Ionicons name={passwordVisible ? 'eye' : 'eye-off'} size={20} color="#888" />
        </TouchableOpacity>
      </View>
      <Text style={styles.infoText}>Sua senha deve conter no mínimo 6 dígitos</Text>

      {/* Confirmar Senha */}
      <Text style={styles.label}>Confirmar senha</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Insira sua senha para confirmação"
          placeholderTextColor="#aaa"
          secureTextEntry={!confirmPasswordVisible}
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />
        <TouchableOpacity style={styles.eyeIcon} onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
          <Ionicons name={confirmPasswordVisible ? 'eye' : 'eye-off'} size={20} color="#888" />
        </TouchableOpacity>
      </View>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      {/* Criar Conta Button */}
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.registerButtonText}>Criar conta</Text>}
      </TouchableOpacity>

      {/* Login Link */}
      <Text style={styles.loginText}>
        Já tem uma conta? 
        <TouchableOpacity onPress={() => router.push('../fono_login')}>
          <Text style={styles.loginLink}> Login</Text>
        </TouchableOpacity>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 30,
  },
  logo: {
    width: 300,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#006FFD',
    fontFamily: 'PlusJakartaSans_600Bold',
  },
  title: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans_600',
    fontWeight: 'bold',
    color: '#006FFD',
    marginBottom: 20,
  },
  label: {
    width: '85%',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    height: 50,
    borderWidth: 1,
    borderColor: '#B0B0B0',
  },
  input: {
    flex: 1,
    height: 50,
    color: '#333',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600',
    outlineStyle: 'none',
  },
  eyeIcon: {
    padding: 10,
  },
  infoText: {
    width: '85%',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600',
    color: '#888',
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    fontFamily: 'PlusJakartaSans_600',
    marginBottom: 10,
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#006FFD',
    width: '85%',
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 3,
    marginTop: 20,
  },
  registerButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600',
    fontWeight: 'bold',
  },
  loginText: {
    marginTop: 20,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600',
    color: '#555',
  },
  loginLink: {
    color: '#FF9096',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600',
    fontWeight: 'bold',
  },
});