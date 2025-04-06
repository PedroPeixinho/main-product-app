import React, { useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

import { ButtonApp } from "@/components/ButtonApp";
import { Video, AVPlaybackStatus, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

export default function AllExerciseCompletedScreen() {
  const { id_exercicio, videoURL, result } = useLocalSearchParams();
  const [date, setDate] = useState(new Date());
  const [duration, setDuration] = useState("");
  const [status, setStatus] = useState("");
  const [video, setVideo] = useState("");
  const [nameExecution, setNameExecution] = useState("");

  const router = useRouter();

  const [videoStatus, setVideoStatus] = useState<AVPlaybackStatus | null>(null);

  const videoRef = useRef(null);

  const handlePlayVideo = async () => {
    if (videoRef.current) {
      try {
        const videoRefCurrent = videoRef.current as any;
        if (typeof videoRefCurrent.getStatusAsync === "function") {
          const status = await videoRefCurrent.getStatusAsync();
          if (status.isPlaying) {
            await videoRefCurrent.pauseAsync();
          } else {
            await videoRefCurrent.playAsync();
          }
        }
      } catch (error) {
        console.error("Erro ao manipular o vídeo:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.emoji}
        source={require("@/assets/images/smile_face.png")}
      />

      <Text style={styles.title}>Exercício concluído!</Text>
      <Text style={styles.subtitle}>Parabéns!</Text>

      <View style={styles.statusContainer}>
        <View style={styles.statusDuration}>
          <Image
            style={styles.relogio}
            source={require("@/assets/images/icon_relogio.png")}
          />
          <Text style={styles.statusText}>1min35s</Text>
        </View>
      </View>

      <View>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "PlusJakartaSans_700Bold",
          }}
        >
          Volte amanhã para realizar os próximos exercícios
        </Text>
      </View>

      <ButtonApp
        title="Página inicial"
        onPress={() => {
          router.push({
            pathname: "/(tabsPaciente)/homePaciente",
            params: { done: "1" },
          }); //MUDAR ROTA
        }}
        color="pink"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  videoWrapper: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  playButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 70,
  },
  emoji: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "PlusJakartaSans_700Bold",
    color: "#006FFD",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 5,
    fontFamily: "PlusJakartaSans_600SemiBold",
    textAlign: "center",
  },
  date: {
    fontSize: 12,
    marginTop: 5,
    color: "#50525A",
    fontFamily: "PlusJakartaSans_600SemiBold",
    marginBottom: 10,
    textAlign: "center",
  },
  image: {
    width: 200,
    height: 50,
    borderRadius: 10,
    marginBottom: 10,
  },
  videoContainer: {
    width: "90%",
    height: 200,
    backgroundColor: "#E7E7E7",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "85%",
    marginBottom: 50,
  },
  statusDuration: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  statusText: {
    fontSize: 16,
    color: "#006FFD",
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  relogio: {
    width: 18,
    resizeMode: "contain",
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  statusBadge: {
    color: "#fff",
    fontFamily: "PlusJakartaSans_600SemiBold",
    paddingVertical: 5,
    fontSize: 12,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  nextButton: {
    backgroundColor: "#006FFD",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    width: "90%",
    marginBottom: 10,
  },
  nextButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  repeatButton: {
    backgroundColor: "#F44336",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    width: "90%",
  },
  repeatButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
