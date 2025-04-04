import {
  CameraMode,
  CameraType,
  CameraView,
  useCameraPermissions,
} from 'expo-camera';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Ellipse } from 'react-native-svg';

export default function App() {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [recording, setRecording] = useState(false);
  const [time, setTime] = useState(0);
  const [instructionText, setInstructionText] = useState(
    'Mantenha o rosto na marcação indicada e comece a gravação'
  );

  let timer: any = null;

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>
          Precisamos da sua permissão para usar a câmera.
        </Text>
        <Pressable style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Conceder Permissão</Text>
        </Pressable>
      </View>
    );
  }

  const startRecording = async () => {
    setRecording(true);
    setTime(0);
    setInstructionText('Realize o exercício');

    timer = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    await ref.current?.recordAsync();
    clearInterval(timer);
  };

  const stopRecording = () => {
    setRecording(false);
    ref.current?.stopRecording();
    clearInterval(timer);
    setInstructionText('Mantenha o rosto na marcação indicada e comece a gravação'); // Resetando o texto
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <View style={styles.container}>
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
              <Text style={styles.finishButtonText}>✔ Concluir</Text>
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
              navigation.goBack();
            }}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Voltar</Text>
          </Pressable>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  faceOutline: {
    position: 'absolute',
    top: '25%',
    alignSelf: 'center',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  timerContainer: {
    position: 'absolute',
    top: 80,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo arredondado e transparente
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    marginRight: 5,
  },
  timerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructionText: {
    position: 'absolute',
    top: 120,
    left: 60,
    right: 60,
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#006ffd',
    width: 300,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  startButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18, // Aumento do tamanho da fonte
    fontWeight: 'bold',
  },
  whiteDot: {
    width: 12, // Tamanho da bolinha
    height: 12,
    backgroundColor: 'white',
    borderRadius: 6, // Torna a bolinha circular
    marginRight: 10, // Espaço entre a bolinha e o texto
  },  
  finishButton: {
    backgroundColor: '#FF758C',
    width: 300, // Aumento da largura
    paddingVertical: 16, // Aumento da altura
    borderRadius: 30, // Ajuste para manter o design arredondado
    alignItems: 'center',
    marginBottom: 15,
  },
  finishButtonText: {
    color: 'white',
    fontSize: 18, // Aumento do tamanho da fonte
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: 300, // Aumento da largura
    paddingVertical: 16, // Aumento da altura
    borderRadius: 30, // Ajuste para manter o design arredondado
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 18, // Aumento do tamanho da fonte
    fontWeight: 'bold',
  },
  permissionButton: {
    marginTop: 20,
    backgroundColor: '#0066FF',
    padding: 10,
    borderRadius: 5,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});