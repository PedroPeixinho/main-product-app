import React, {useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthRedirect} from '../../services/auth';

export default function WelcomeScreen() {
  useAuthRedirect()

  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require('../../assets/images/Logo final.png')} style={styles.logo} />

      {/* Bem-vindo Text */}
      <Text style={styles.subtitle}>Bem-vindo!</Text>

      {/* Pergunta */}
      <Text style={styles.question}>Quem é você?</Text>

      {/* Buttons */}
      <TouchableOpacity style={[styles.button, styles.blueButton]} onPress={() => router.push('../patient_login')}>
        <Text style={styles.blueButtonText}>Paciente ou responsável</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.pinkButton]} onPress={() => router.push('../fono_login')}>
        <Text style={styles.pinkButtonText}>Fonoaudiólogo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 300,
    height: 180,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_600Bold',
    color: '#FF9096',
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans_600Bold',
    color: '#006FFD',
    marginBottom: 10,
  },
  button: {
    width: '85%',
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  blueButton: {
    backgroundColor: '#006FFD',
  },
  pinkButton: {
    backgroundColor: '#FF9096',
  },
  blueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600Bold',
  },
  pinkButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'PlusJakartaSans_600Bold',
  },
});
