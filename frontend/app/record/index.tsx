import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  CameraMode,
  CameraType,
  CameraView,
  useMicrophonePermissions,
  useCameraPermissions,
} from "expo-camera";
import Svg, { Ellipse } from "react-native-svg";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getUserDetails, isAuthenticated } from "../../services/auth";
import uploadVideoService from "../../services/video";

interface UserDetails {
  cpf: string;
}

export default function RecordScreen() {
  const router = useRouter();
  const [waiting, setWaiting] = useState(false);
  const [microphone, requestMicrophone] = useMicrophonePermissions();
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [recording, setRecording] = useState(false);
  const [time, setTime] = useState(0);
  const [instructionText, setInstructionText] = useState(
    "Mantenha o rosto na marcação indicada e comece a gravação"
  );
  const [userDetails, setUserDetails] = useState<UserDetails>({ cpf: "" });

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (await isAuthenticated()) {
        // Se o usuário estiver autenticado, busca os detalhes
        const details = await getUserDetails();
        setUserDetails(details ?? { cpf: "1" });
      } else {
        // Se não estiver autenticado, redireciona para a tela de login
        router.push("../");
      }
    };
    fetchUserDetails();
  }, []);

  let timer: any = null;
  // const cpf = '12345678900';
  const cpf = userDetails.cpf;
  const { id_exercicio } = useLocalSearchParams();
  const exercicioId = Number(id_exercicio);

  if (!permission) return null;

  if (!microphone) return null;

  if (!permission.granted || !microphone.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          Precisamos da sua permissão para usar a câmera.
        </Text>
        <Pressable style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Conceder Permissão</Text>
        </Pressable>
        <Pressable style={styles.permissionButton} onPress={requestMicrophone}>
          <Text style={styles.permissionButtonText}>Permitir Microfone</Text>
        </Pressable>
      </View>
    );
  }

  const startRecording = async () => {
    try {
      setRecording(true);
      setTime(0);
      setInstructionText("Realize o exercício");

      timer = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
      console.log("Iniciando gravação...");
      const videoRecord = await ref.current?.recordAsync();
      console.log("Gravação concluida...");
      clearInterval(timer);
      if (videoRecord) {
        setWaiting(true);
        const result = await uploadVideoService(cpf, exercicioId, videoRecord);
        setWaiting(false);
        if (result) {
          console.log("Vídeo enviado com sucesso!");
          router.push({
            pathname: "/exer",
            params: {
              id_exercicio,
              videoURL: 1,
              result: result.data.resultado,
              nomeVideo:
                result.data.videoPath.split("/")[
                  result.data.videoPath.split("/").length - 1
                ],
            },
          });
        } else {
          console.error("Falha ao enviar o vídeo.");
        }
      }
    } catch (error) {
      clearInterval(timer);
      console.error("Erro ao gravar vídeo:", error);
      setInstructionText("Erro ao iniciar a gravação.");
      setRecording(false);
    }
  };

  const stopRecording = () => {
    console.log("Parando gravação...");
    setRecording(false);
    ref.current?.stopRecording();
    console.log("Gravação parada...");
    clearInterval(timer);
    setInstructionText(
      "Mantenha o rosto na marcação indicada e comece a gravação"
    );
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <View style={styles.container}>
      {waiting ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "PlusJakartaSans_700Bold",
              fontSize: 28,
              color: "#006FFD",
            }}
          >
            Aguarde um pouco
          </Text>
          <Text
            style={{
              fontFamily: "PlusJakartaSans_700Bold",
              fontSize: 20,
              marginBottom: 70,
            }}
          >
            Estamos analisando seu vídeo
          </Text>
          <ActivityIndicator size={140} color={"#FF9096"} />
        </View>
      ) : (
        <CameraView
          animateShutter={true}
          active={true}
          style={styles.camera}
          ref={ref}
          mode="video"
          facing="front"
          mute={false}
        >
          <Svg
            style={styles.faceOutline}
            height="380"
            width="290"
            viewBox="0 0 290 380"
          >
            <Ellipse
              cx="145"
              cy="190"
              rx="125"
              ry="180"
              stroke="white"
              strokeWidth="4"
              strokeDasharray="10 10"
              fill="none"
            />
          </Svg>

          {recording && (
            <View style={styles.timerContainer}>
              <View style={styles.dot} />
              <Text style={styles.timerText}>{formatTime(time)}</Text>
            </View>
          )}

          <Text style={styles.instructionText}>{instructionText}</Text>

          <View style={styles.controlsContainer}>
            {recording ? (
              <Pressable style={styles.finishButton} onPress={stopRecording}>
                <View style={styles.finishButtonContent}>
                  <Icon name="check" size={24} color="white" />
                  <Text style={styles.finishButtonText}> Concluir</Text>
                </View>
              </Pressable>
            ) : (
              <Pressable style={styles.startButton} onPress={startRecording}>
                <View style={styles.startButtonContent}>
                  <View style={styles.whiteDot} />
                  <Text style={styles.startButtonText}>Iniciar gravação</Text>
                </View>
              </Pressable>
            )}

            <Pressable
              onPress={() => {
                if (recording) stopRecording();
                router.back();
              }}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>Voltar</Text>
            </Pressable>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  faceOutline: {
    position: "absolute",
    top: "25%",
    alignSelf: "center",
  },
  controlsContainer: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
  },
  timerContainer: {
    position: "absolute",
    top: 80,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: "red",
    borderRadius: 5,
    marginRight: 5,
  },
  timerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  instructionText: {
    position: "absolute",
    top: 120,
    left: 60,
    right: 60,
    textAlign: "center",
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  startButton: {
    backgroundColor: "#006ffd",
    width: 300,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  startButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  whiteDot: {
    width: 12,
    height: 12,
    backgroundColor: "white",
    borderRadius: 6,
    marginRight: 10,
  },
  finishButton: {
    backgroundColor: "#FF758C",
    width: 300,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 15,
  },
  finishButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  finishButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    width: 300,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  backButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  permissionButton: {
    marginTop: 20,
    backgroundColor: "#0066FF",
    padding: 10,
    borderRadius: 5,
  },
  permissionButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});
