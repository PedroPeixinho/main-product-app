import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';

export default function ExerciseCompletedScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back-ios" size={24} color="#006FFD" />
          </TouchableOpacity>
        </View>
        
        <Image style={styles.emoji} source={require('/home/ubuntu/Área de trabalho/projetao/main-product-app/frontend/assets/images/smile_face.png')} />
        <Text style={styles.title}>Exercício concluído!</Text>
        <Text style={styles.subtitle}>Lateralização</Text>
        <Text style={styles.date}>11/02/2025 - 10h25</Text>
          
        <Image
          style={styles.image}
          source={{ uri: 'https://example.com/image.png' }}
        />

        {/* Espaço para o vídeo enviado pelo usuário */}
        <View style={styles.videoContainer}>
          <WebView
            style={{ width: '100%', height: '100%' }}
            source={{ uri: 'https://www.youtube.com/shorts/M3EMmRTLsb8' }}
          />
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>1min35s</Text>
          <Text style={styles.statusBadge}>PARCIALMENTE CORRETO</Text>
        </View>
        
        <TouchableOpacity style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Próximo exercício</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.repeatButton}>
          <Text style={styles.repeatButtonText}>Repetir</Text>
        </TouchableOpacity>
      </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#006FFD',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 5,
    textAlign: 'center',
  },
  date: {
    fontSize: 14,
    color: '#50525A',
    marginBottom: 10,
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 50,
    borderRadius: 10,
    marginBottom: 10,
  },
  videoContainer: {
    width: '90%',
    height: 200,
    backgroundColor: '#E7E7E7',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statusText: {
    fontSize: 16,
    color: '#006FFD',
  },
  statusBadge: {
    backgroundColor: '#FFC107',
    color: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  nextButton: {
    backgroundColor: '#006FFD',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '90%',
    marginBottom: 10,
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  repeatButton: {
    backgroundColor: '#F44336',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    width: '90%',
  },
  repeatButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
