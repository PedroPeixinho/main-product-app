import React, { useState, useEffect } from 'react';
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
import { getUserDetails, isAuthenticated} from '../../services/auth';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Clipboard from 'expo-clipboard';

interface UserDetails {
  cpf: string;
}

export default function RegisterScreen() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [nome, setNome] = useState('');
  const [cpf_paciente, setCpfPaciente] = useState('');
  const [feedback, setFedaback] = useState('');
  const [nome_usuario, setNome_usuario] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails>({ cpf: "" });
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (await isAuthenticated()) {
        // Se o usuário estiver autenticado, busca os detalhes
        const details = await getUserDetails();
        console.log("User details:", details);
        setUserDetails(details ?? { cpf: "1" });
      } else {
        // Se não estiver autenticado, redireciona para a tela de login
        router.push("../");
      }
    };
    fetchUserDetails();
  }, []);  

  
  const handleCopyEmail = async () => {
    await Clipboard.setStringAsync(nome_usuario);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000); // feedback desaparece em 2s
  };
  
  const handleCopyPassword = async () => {
    await Clipboard.setStringAsync(senha);
    setCopiedPassword(true);
    setTimeout(() => setCopiedPassword(false), 2000); // feedback desaparece em 2s
  };

  const handleRegister = async () => {
    setErrorMessage('');
    setLoading(true);
  
    if (senha !== confirmarSenha) {
      setErrorMessage('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    const cpf_fono = userDetails.cpf;
    const cpf = cpf_paciente;

    console.log('Dados do paciente:', { cpf_fono, nome, cpf, feedback, nome_usuario, senha });

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/patient/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf_fono, nome, cpf, feedback, nome_usuario, senha }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar conta');
      }
  
      // Store token and navigate to home
      //await AsyncStorage.setItem("token", data.token);
      router.push('../(tabs)/explore');  // MUDAR ROTA
  
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
      <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back-ios" size={24} color="#006FFD" />
          </TouchableOpacity>
          <Text style={styles.title}>Voltar</Text>
          <Text></Text>
        </View>

      {/* Nome */}
      <Text style={styles.label}>Nome do paciente</Text>
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input}
          placeholder="Nome completo do seu paciente"
          placeholderTextColor="#aaa"
          value={nome}
          onChangeText={setNome}
        />
      </View>

      {/* CPF */}
      <Text style={styles.label}>CPF</Text>
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Insira o CPF do seu paciente (somente números)" 
          placeholderTextColor="#aaa"
          value={cpf_paciente}
          onChangeText={setCpfPaciente}
          keyboardType="numeric"
          maxLength={11}
        />
      </View>

      {/* Diagnóstico (feedaback) texto de até 40 caracteres */}
      <Text style={styles.label}>Diagnóstico</Text>
      <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Insira o diagnóstico do paciente"
        placeholderTextColor="#aaa"
        value={feedback}
        onChangeText={setFedaback}
        maxLength={40}
      />      
      </View>
      {/* Linha divisoria de seção */}
      <View style={styles.divider} />

      { /* TEXTO INFORMATIVO */}
      <Text style={styles.infoDividerText}>
        Preencha as informações abaixo para o paciente conseguir acessar o aplicativo
      </Text>

      {/* E-mail */}
      <Text style={styles.label}>E-mail do paciente</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Informe um e-mail válido"
          placeholderTextColor="#aaa"
          value={nome_usuario}
          onChangeText={setNome_usuario}
          keyboardType="email-address"
          autoCapitalize="none"
          />
        {/* Touchable para copiar para a area de transferncia o email do campo */}
        <TouchableOpacity onPress={handleCopyEmail}>
          <Ionicons name="copy" size={20} color="#888" />
        </TouchableOpacity>
      </View>
      {copiedEmail && (
        <Text style={{ color: 'green', fontSize: 12, marginBottom: 10 }}>
          E-mail copiado para a área de transferência!
        </Text>
      )}

      {/* Senha */}
      <Text style={styles.label}>Senha do paciente</Text>
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
        {/* touchable para copiar senha  */}
        <TouchableOpacity onPress={handleCopyPassword}>
          <Ionicons name="copy" size={20} color="#888" />
        </TouchableOpacity>
      </View>
      <Text style={styles.infoTextAcess}>A senha deve conter no mínimo 6 dígitos</Text>
      {copiedPassword && (
        <Text style={{ color: 'green', fontSize: 12, marginBottom: 10 }}>
          Senha copiada para a área de transferência!
        </Text>
      )}      

      {/* Confirmar Senha */}
      <Text style={styles.label}>Confirmar senha</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Insira a senha para confirmação"
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
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.registerButtonText}>Concluir cadastro</Text>}
      </TouchableOpacity>

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
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  title: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans_700Bold',
    fontWeight: 'bold',
    color: '#006FFD',
    marginBottom: 20,
  },
  label: {
    width: '85%',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600SemiBold',
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
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  eyeIcon: {
    padding: 10,
  },
  infoText: {
    width: '85%',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#50525A',
    marginBottom: 10,
  },
  infoTextAcess:{
    width: '85%',
    fontSize: 12,
    marginTop: -5,
    fontFamily: 'PlusJakartaSans_400Regular',
    color: '#222429',
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    fontFamily: 'PlusJakartaSans_400Regular',
    marginBottom: 10,
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#006FFD',
    width: '85%',
    paddingVertical: 15,
    borderRadius: 30,
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
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontWeight: 'bold',
  },
  loginText: {
    marginTop: 20,
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    color: '#555',
  },
  loginLink: {
    color: '#FF9096',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 24,
    paddingTop: 47,
    paddingBottom: 14,
  },
  divider: {
    width: '85%',          // mesmo comprimento dos inputs
    height: 1,             // altura fina para uma linha
    backgroundColor: '#E0E0E0', // cor cinza claro (ajuste conforme desejado)
    marginVertical: 20,    // espaçamento vertical acima e abaixo
  },
  infoDividerText: {
    width: '85%',                 // Alinhado aos inputs
    fontSize: 13,                 // Fonte pequena, mais discreta
    color: '#50525A',             // Tom cinza-escuro, semelhante à imagem
    marginBottom: 20,             // Espaçamento inferior
    marginTop: -5,                // Espaçamento superior ajustado
    fontFamily: 'PlusJakartaSans_400Regular', // Fonte regular
  },
    
});