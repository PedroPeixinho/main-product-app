import React, { useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";

import { ButtonApp } from "@/components/ButtonApp";
import { Video, AVPlaybackStatus, ResizeMode } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

export default function ExerciseCompletedScreen() {
  const { id_exercicio, videoURL, result, nomeVideo, duration } =
    useLocalSearchParams();
  const [date, setDate] = useState(new Date());
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [status, setStatus] = useState("");
  const [video, setVideo] = useState("");
  const [nameExecution, setNameExecution] = useState("");

  const router = useRouter();

  const [videoStatus, setVideoStatus] = useState<AVPlaybackStatus | null>(null);

  const videoRef = useRef(null);

  useEffect(() => {
    if (duration && typeof duration === "string") {
      const totalSeconds = parseInt(duration);
      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;

      setMinutes(String(mins).padStart(1, "0"));
      setSeconds(String(secs).padStart(2, "0"));
    }
  }, [duration]);

  const handleStopVideo = async () => {
    if (videoRef.current) {
      try {
        const videoRefCurrent = videoRef.current as any;
        if (typeof videoRefCurrent.getStatusAsync === "function") {
          const status = await videoRefCurrent.getStatusAsync();
          if (status.isPlaying) {
            await videoRefCurrent.pauseAsync();
          }
        }
      } catch (error) {
        console.log("Erro ao manipular o vídeo:", error);
      }
    }
  };

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
        console.log("Erro ao manipular o vídeo:", error);
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
      <Text style={styles.subtitle}>
        {id_exercicio == "1"
          ? "Lateralizar"
          : id_exercicio == "2"
            ? "Protruir e retrair"
            : id_exercicio == "3"
              ? "Inflar e desinflar"
              : id_exercicio == "4"
                ? "Boca de peixe"
                : "Exercicio nao cadastrado"}
      </Text>
      <Text style={styles.date}>
        {date.toLocaleDateString()} -{" "}
        {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </Text>

      <Image
        style={styles.image}
        source={{ uri: "https://example.com/image.png" }}
      />

      {/* Espaço para o vídeo enviado pelo usuário */}
      <View style={styles.videoContainer}>
        <TouchableOpacity
          style={styles.videoWrapper}
          onPress={handlePlayVideo}
          activeOpacity={0.8}
        >
          <Video
            ref={videoRef}
            source={{
              uri: `${process.env.EXPO_PUBLIC_API_URL}/videos/${nomeVideo}`,
            }}
            style={styles.video}
            useNativeControls={false}
            resizeMode={ResizeMode.CONTAIN}
            isLooping={true}
            onPlaybackStatusUpdate={(status) => setVideoStatus(status)}
          />
          {videoStatus?.isLoaded && !videoStatus.isPlaying && (
            <View style={styles.playButton}>
              <Ionicons name="play" size={24} color="#FFFFFF" />
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.statusContainer}>
        <View style={styles.statusDuration}>
          <Image
            style={styles.relogio}
            source={require("@/assets/images/icon_relogio.png")}
          />
          <Text style={styles.statusText}>{`${minutes}min${seconds}s`}</Text>
        </View>
        <Text
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                result === "Correto"
                  ? "#04AC52"
                  : result === "Parcialmente Correto"
                    ? "#FDA400"
                    : "#DE0B0B",
            },
          ]}
        >
          {result}
        </Text>
      </View>

      <ButtonApp
        title={id_exercicio == "4" ? "Finalizar" : "Proximo exercício"}
        onPress={async () => {
          await handleStopVideo();
          if (id_exercicio == "4") {
            router.push({
              pathname: "/exerFinalizados",
              params: {
                id_exercicio,
                videoURL: 1,
                result: "Correto",
              },
            }); //MUDAR ROTA
          } else {
            router.push({
              pathname: "../iniciarExercicio",
              params: { id_exercicio: Number(id_exercicio) + 1 },
            }); //MUDAR ROTA
          }
        }}
        color="blue"
      />

      <ButtonApp
        title="Repetir"
        onPress={async () => {
          await handleStopVideo();
          router.push({
            pathname: "../iniciarExercicio",
            params: { id_exercicio },
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
