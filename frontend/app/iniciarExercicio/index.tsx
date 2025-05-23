import React, { useRef, useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Video, AVPlaybackStatus, ResizeMode } from "expo-av";
import { Platform, StatusBar } from "react-native";

export default function StartExercise() {
  const { id_exercicio } = useLocalSearchParams();
  const router = useRouter();
  const { exerciseId } = useLocalSearchParams();
  const videoRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoStatus, setVideoStatus] = useState<AVPlaybackStatus | null>(null);

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

  //front
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={async () => {
            await handleStopVideo();
            router.back();
          }}
        >
          <Ionicons name="chevron-back" size={24} color="#007BFF" />
        </TouchableOpacity>
        <Text style={styles.dayText}>
          {new Date().toLocaleDateString("pt-BR", { weekday: "long" })}
        </Text>
        <View style={styles.placeholderView} />
      </View>

      <View style={styles.mainContent}>
        <Text style={styles.subtitle}>Vídeo demonstrativo:</Text>

        <View style={styles.videoContainer}>
          <TouchableOpacity
            style={styles.videoWrapper}
            onPress={handlePlayVideo}
            activeOpacity={0.8}
          >
            <Video
              ref={videoRef}
              source={{
                uri: `${process.env.EXPO_PUBLIC_API_URL}/videos/${id_exercicio}.mp4`,
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

        <Text style={styles.exerciseTitle}>
          {/* {exercise?.nome_exercicio || "Lateralizar"} */}
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

        <View style={styles.tagContainer}>
          {/* <Text style={styles.tag}>{reps}</Text> */}
          <Text style={styles.tag}>
            {id_exercicio == "1"
              ? "1x10"
              : id_exercicio == "2"
                ? "1x10"
                : id_exercicio == "3"
                  ? "1x10"
                  : id_exercicio == "4"
                    ? "1x10"
                    : "Exercicio nao cadastrado"}
          </Text>
        </View>

        <View
          style={{
            marginTop: 23,
          }}
        >
          {id_exercicio == "1" ? (
            <>
              <Text style={styles.info}>
                1 ) Realizar 10x de cada lado, 1 vez ao dia
              </Text>
              <Text style={styles.info}>
                2 ) Tocar ponta da língua nas laterais dos lábios
              </Text>
            </>
          ) : id_exercicio == "2" ? (
            <>
              <Text style={styles.info}>1 ) Realizar 10x, 1 vez ao dia</Text>
              <Text style={styles.info}>
                2) Com a boca aberta, protruir (colocar para fora) e retrair
                (puxar para dentro) a língua.
              </Text>
            </>
          ) : id_exercicio == "3" ? (
            <>
              <Text style={styles.info}>
                1 ) Realizar 10x de cada lado, 1 vez ao dia
              </Text>
              <Text style={styles.info}>
                2) Inflar cada lado da bochecha, um por vez, com os lábios
                fechados
              </Text>
            </>
          ) : id_exercicio == "4" ? (
            <>
              <Text style={styles.info}>1 ) Realizar 10x, 1 vez ao dia</Text>
              <Text style={styles.info}>
                2 ) Com os lábios fechados, encher a boca de ar e fazer os
                lábios vibrarem, como se estivesse imitando o som de um motor ou
                fazendo “brbrbr” com a boca
              </Text>
            </>
          ) : (
            <Text style={styles.info}>Exercicio nao cadastrado</Text>
          )}
        </View>

        {/* {loading ? (
          <Text style={styles.info}>Carregando instruções...</Text>
        ) : instructions.length > 0 ? (
          <Text style={styles.info}>
            {instructions.map(
              (instruction, index) =>
                `${instruction}${index < instructions.length - 1 ? "\n" : ""}`
            )}
          </Text>
        ) : (
          <Text style={styles.info}>Nenhuma instrução disponível.</Text>
        )} */}

        <View style={styles.spacer} />

        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            await handleStopVideo();
            router.push({
              pathname: "/record",
              params: { id_exercicio },
            }); //MUDAR ROTA
          }} // trocar para a rota correta
        >
          <Text style={styles.buttonText}>Realizar exercício</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F0FF",
    marginTop: Platform.OS === "ios" ? 10 + (StatusBar.currentHeight || 0) : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 35,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    padding: 5,
  },
  dayText: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  placeholderView: {
    width: 24,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
    backgroundColor: "#E6F0FF",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_700Bold",
    marginBottom: 10,
  },
  videoContainer: {
    width: "100%",
    height: 180,
    backgroundColor: "#000000",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
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
  exerciseTitle: {
    fontSize: 20,
    alignSelf: "flex-start",
    marginTop: 10,
    fontFamily: "MontserratAlternates_800ExtraBold",
    marginBottom: 10,
  },
  tagContainer: {
    backgroundColor: "#007BFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  tag: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 12,
    color: "#FFFFFF",
  },
  info: {
    fontSize: 16,
    textAlign: "left",
    alignSelf: "flex-start",
    fontFamily: "PlusJakartaSans_500Medium",
    lineHeight: 22,
  },
  spacer: {
    flex: 1,
  },
  button: {
    backgroundColor: "#007BFF",
    width: "100%",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "PlusJakartaSans_700Bold",
  },
});
