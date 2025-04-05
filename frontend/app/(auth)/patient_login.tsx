import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthRedirect } from "../../services/auth";

export default function PatientLoginScreen() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useAuthRedirect();

  const handleLogin = async () => {
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/patient/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome_usuario: nomeUsuario, senha }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao fazer login");
      }

      await AsyncStorage.setItem("token", data.token);
      router.push({
        pathname: "/(tabsPaciente)/homePaciente",
        params: { done: "0" },
      }); //MUDAR ROTA
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Ocorreu um erro desconhecido.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require("../../assets/images/Logo final.png")}
        />
        <Text style={styles.subtitle}>Paciente ou responsável</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Usuário"
          placeholderTextColor="#888"
          value={nomeUsuario}
          onChangeText={setNomeUsuario}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Código de entrada"
          placeholderTextColor="#888"
          secureTextEntry={!passwordVisible}
          value={senha}
          onChangeText={setSenha}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setPasswordVisible(!passwordVisible)}
        >
          <Ionicons
            name={passwordVisible ? "eye" : "eye-off"}
            size={20}
            color="#888"
          />
        </TouchableOpacity>
      </View>

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.loginButtonText}>Login</Text>
        )}
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>
          Peça seu usuário e senha para seu fonoaudiólogo
        </Text>
      </View>

      <TouchableOpacity onPress={() => router.push("/")}>
        <Text style={styles.profissionalLink}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  logo: {
    width: 300,
    height: 180,
    resizeMode: "contain",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans_700Bold",
    color: "#FF9096",
    marginTop: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#B0B0B0",
    paddingHorizontal: 16,
    marginBottom: 15,
    height: 50,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  input: {
    flex: 1,
    height: 50,
    color: "#8F9098",
    fontSize: 13,
    fontFamily: "PlusJakartaSans_400Regular",
  },
  eyeIcon: {
    padding: 10,
  },
  errorText: {
    color: "red",
    fontFamily: "PlusJakartaSans_400Regular",
    marginBottom: 10,
    textAlign: "center",
  },
  loginButton: {
    backgroundColor: "#006FFD",
    width: "85%",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 3,
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontWeight: "bold",
  },
  registerContainer: {
    flexDirection: "row",
    marginTop: 15,
    marginBottom: 5,
  },
  registerText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_600SemiBold",
    color: "#FF9096",
  },
  profissionalLink: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_600SemiBold",
    color: "#006FFD",
  },
});
