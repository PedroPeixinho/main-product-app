// frontend/services/videoService.ts

import api from "..";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define o tipo do vídeo que será enviado (React Native File)
interface VideoRecord {
  uri: string;
}

// Função para gerar um ID aleatório de 6 caracteres alfanuméricos
export const generateRandomId = (): string => {
  return Math.random().toString(36).substring(2, 8);
};

export default async function uploadVideoService(
  cpf: string,
  id_exercicio: number,
  videoRecord: VideoRecord
): Promise<any> {
  const randomId = generateRandomId();
  const fileName = `${cpf}-${id_exercicio}-${randomId}.mp4`;
  const formData = new FormData();
  formData.append("video", {
    uri: videoRecord.uri,
    name: fileName,
    type: "video/mp4",
  } as any);

  try {
    // const token = await AsyncStorage.getItem("token");
    // if (!token) return null;
    const endpoint = `${process.env.EXPO_PUBLIC_API_URL}/record/patient/${cpf}/exercicies/${id_exercicio}/video`;
    // api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    api.defaults.headers.common["Content-Type"] = "multipart/form-data";

    const response = await api.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 200) {
      console.log("Vídeo enviado com sucesso!");
    } else {
      console.log("Falha ao enviar o vídeo.");
    }

    return response;
  } catch (error) {
    console.log("Erro ao enviar o vídeo:", error);
    throw error;
  }
}
