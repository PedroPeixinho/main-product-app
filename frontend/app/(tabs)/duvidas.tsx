import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { PacienteService } from "@/services/pacientes";
import WideButton from "@/components/wideButton";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface Patient {
  id: string;
  nome: string;
  diaConsulta: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  status: "emAcompanhamento" | "emAvaliacao" | "concluido";
  horarioConsulta: string;
  avatarUrl?: string;
}

export default function Explore() {
  const router = useRouter();
  const [searchNomePaciente, setSearchNomePaciente] = useState<string>("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(patients);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await PacienteService.getPacientes();
        const temp: Patient[] = response.map((patient: any) => ({
          id: patient.cpf,
          nome: patient.nome,
          diaConsulta: patient.dia_consulta,
          status: patient.status,
          horarioConsulta: patient.horario_consulta,
          avatarUrl: patient.avatar_url,
        }));
        setPatients(temp);
      } catch (error) {
        console.log("Error fetching patients:", error);
      }
    };
    fetchPatients();
  }, []);

  useEffect(() => {
    setFilteredPatients(patients);
  }, [patients]);

  const filterPatients = (searchNomePaciente: string) => {
    setSearchNomePaciente(searchNomePaciente);
    setFilteredPatients(
      patients.filter((patient) =>
        patient.nome.toLowerCase().includes(searchNomePaciente.toLowerCase())
      )
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dúvidas</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.divider} />
        <View
          style={{
            flex: 1,
            gap: 16,
          }}
        >
          <View style={styles.searchBarDiv}>
            <FontAwesome
              name="search"
              size={16}
              color="#2F3036"
              style={{
                padding: 10,
              }}
            />
            <TextInput
              style={styles.input}
              onChangeText={filterPatients}
              value={searchNomePaciente}
              placeholder="Pesquise alguém para responder"
              keyboardType="default"
            />
          </View>
        </View>
        <View style={styles.pacientesDiv}>
          {filteredPatients.map((item) => (
            <TouchableOpacity
              style={styles.patientItemDiv}
              key={item.id}
              onPress={() => {
                router.navigate("../patientProfile/patientchat");
              }}
            >
              {item.avatarUrl && (
                <Image
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 25,
                    alignItems: "center",
                  }}
                  source={{
                    uri: item.avatarUrl,
                  }}
                />
              )}
              {!item.avatarUrl && (
                <View style={styles.avatarFallback}>
                  <Text>
                    {item.nome
                      .split(" ")
                      .filter(
                        (_, index, arr) =>
                          index === 0 || index === arr.length - 1
                      )
                      .map((name) => name[0])
                      .join("")}
                  </Text>
                </View>
              )}

              <View style={styles.chatBubble}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.patientName}>{item.nome}</Text>
                  <Text style={styles.chatTime}>{item.horarioConsulta}</Text>
                </View>
                <Text style={styles.chatMessage}>
                  {
                    [
                      "Minha filha não melhorou a pronúncia do 'R'?",
                      "Por que minha voz falha quando faço os vídeos?",
                      "Tenho notado que Sofia têm ido mal no exercício de estalar, pode dar uma olhada? É normal?",
                      "Pode mandar mais exercícios?",
                      "Como parar de engolir as palavras?",
                      "Fono ajuda a reduzir o sotaque também? rsrsrs",
                      "Por que fico rouco facilmente?",
                    ][item.diaConsulta]
                  }
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 36,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  body: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: "MontserratAlternates_800ExtraBold",
    fontWeight: 900,
  },
  searchBarDiv: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    borderRadius: 24,
    padding: 10,
    backgroundColor: "#F8F9FE",
  },
  input: {
    backgroundColor: "#F8F9FE",
    flex: 1,
    maxHeight: 40,
  },
  divider: {
    marginTop: 25,
    height: 1,
    backgroundColor: "#E7E7E7",
  },

  pacientesDiv: {
    marginTop: 16,
  },
  patientItemDiv: {
    flexDirection: "row",
    gap: 10,
    padding: 5,
    borderRadius: 24,
    marginTop: 3,
    alignItems: "center", // <-- importante!
  },
  patientItemSubTextDiv: {
    flexDirection: "row",
    gap: 8,
  },

  avatarFallback: {
    width: 56,
    height: 56,
    borderRadius: 25,
    backgroundColor: "#E7E7E7",
    justifyContent: "center",
    alignItems: "center",
  },

  chatBubble: {
    flex: 1,
    borderRadius: 16,
    padding: 5,
    justifyContent: "center",
  },

  patientName: {
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 6,
    color: "#2F3036",
    fontFamily: "PlusJakartaSans_600SemiBold",
  },

  chatMessage: {
    fontSize: 12,
    color: "#50525A",
    fontFamily: "PlusJakartaSans_400Regular",
  },

  chatTime: {
    fontSize: 12,
    color: "#A0A0A0",
    textAlign: "right",

    fontFamily: "PlusJakartaSans_400Regular",
  },
});
