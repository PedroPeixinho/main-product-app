import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { Link } from 'expo-router';

export default function Index() {
  const colorScheme: 'light' | 'dark' = useColorScheme() ?? 'light';
  const styles = getStyles(colorScheme);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Foninho!</Text>

      <View style={styles.formContainer}>
        <Text style={styles.texto}>Login</Text>
        <TextInput
          style={[styles.inputs, isFocused && styles.inputFocused]}
          placeholder="Email, usuário..."
          placeholderTextColor="gray"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        <Text style={styles.texto}>Senha</Text>
        <TextInput
          secureTextEntry
          style={styles.inputs}
          placeholder="Digite sua senha..."
          placeholderTextColor="gray"
        />
      </View>

      <Link href='./forgot_password'>
        <Text style={styles.forgot}>Esqueci minha senha</Text>
      </Link>

      <Link style={styles.button} href="../(tabs)/home">
        <Button title="Entrar" />
      </Link>
    </View>
  );
}

// Definição correta dos estilos
const getStyles = (colorScheme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors[colorScheme].background,
    },
    titulo: {
      color: Colors[colorScheme].text,
      fontSize: 26,
      fontWeight: 'bold',
      marginTop: -150,
      marginBottom: 150,
    },
    formContainer: {
      width: '50%', 
    },
    texto: {
      color: Colors[colorScheme].text,
      fontSize: 16,
      alignSelf: 'flex-start',
      marginBottom: 5,
    },
    button : {
      marginTop: 20,
    },
    forgot: {
      color: Colors[colorScheme].text,
      fontSize: 10,
      textDecorationLine: 'underline',
    },
    inputs: {
      width: '100%',
      borderRadius: 5, 
      padding: 10,
      marginBottom: 15,
      backgroundColor: 'white',
      borderWidth: 1,
      borderColor: 'gray',
    },
    inputFocused: {
      borderColor: 'transparent',
    },
  });

