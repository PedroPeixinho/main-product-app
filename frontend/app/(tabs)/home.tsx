import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { PacienteService } from "@/services/pacientes";
import { useRouter } from "expo-router";
import WideButton from "@/components/wideButton";
import { getUserDetails } from "@/services/auth";

interface Question {
  avatarUrl?: string;
  id: string;
  nomePaciente: string;
  hour: string;
  data: Date;
  qtdQuestion: number;
}

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("Maiara");
  const [question, setQuestion] = useState<Question[]>([]);
  const [qtdPatients, setQtdPatients] = useState<number>(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDetails = await getUserDetails();
        if (userDetails?.cpf) setName(userDetails.nome);
      } catch (error) {
        console.error("Erro ao buscar detalhes do usuário:", error);
      }
    };

    fetchUser();
    const fetchPatients = async () => {
      try {
        const response = await PacienteService.getPacientes();
        const temp = response.map((patient: any) => ({
          id: patient.cpf,
          nome: patient.nome,
          diaConsulta: patient.dia_consulta,
          status: patient.status,
          horarioConsulta: patient.horario_consulta,
          avatarUrl: patient.avatar_url,
        }));
        setQtdPatients(temp.length);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
    fetchPatients();
    const fetchQuestion = async () => {
      try {
        const response = await PacienteService.getDuvidas();
        const temp: Question[] = response.map((duvida: any) => ({
          avatarUrl: duvida.avatar_url,
          id: duvida.cpf,
          nomePaciente: duvida.nome,
          hour: new Date(duvida.ultima_duvida).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          data: new Date(duvida.ultima_duvida),
          qtdQuestion: duvida.qtd_duvidas_nao_lidas,
        }));
        setQuestion(temp);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchQuestion();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Olá, {name}!</Text>
      </View>
      <View style={styles.totalPacientesDiv}>
        <View
          style={{
            flex: 1,
            gap: 16,
          }}
        >
          <View style={styles.totalPacientesText}>
            <Text style={styles.subtitle}>Total de pacientes:</Text>
            <Text style={styles.totalPacientesTitle}>{qtdPatients}</Text>
          </View>
          <WideButton
            text="Cadastrar paciente"
            onPress={() => {
              router.navigate("../patient/new_patient");
            }}
          />
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.questionDiv}>
        <View style={styles.questionDivHeader}>
          <Text style={styles.subtitle}>Últimas mensagens</Text>
        </View>
        <View style={styles.questionDivBody}>
          {question.map((item) => (
            <TouchableOpacity key={item.id} style={styles.questionItemDiv}>
              {item.avatarUrl && (
                <Image
                  style={{ width: 35, height: 35, borderRadius: 25 }}
                  source={{
                    uri: item.avatarUrl,
                  }}
                />
              )}
              {!item.avatarUrl && (
                <View
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 25,
                    backgroundColor: "#E7E7E7",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text>
                    {item.nomePaciente
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
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  marginLeft: 8,
                }}
              >
                <View style={styles.appointmentItemTextDiv}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#50525A",
                      fontFamily: "PlusJakartaSans_600SemiBold",
                    }}
                  >
                    {item.nomePaciente}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 4,
                  }}
                >
                  <Text
                    style={{
                      color: "#50525A",
                      fontSize: 12,
                      fontFamily: "PlusJakartaSans_400Regular",
                    }}
                  >{`${item.data.getDate().toString().padStart(2, "0")}/${(item.data.getMonth() + 1).toString().padStart(2, "0")}/${item.data.getFullYear()}`}</Text>
                  <Text
                    style={{
                      color: "#50525A",
                      fontSize: 12,
                      fontFamily: "PlusJakartaSans_400Regular",
                    }}
                  >
                    |
                  </Text>
                  <Text
                    style={{
                      color: "#50525A",
                      fontSize: 12,
                      fontFamily: "PlusJakartaSans_400Regular",
                    }}
                  >
                    {item.hour}
                  </Text>
                </View>
              </View>
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 9,
                      backgroundColor: "#006FFD",
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: "PlusJakartaSans_400Regular",
                      fontSize: 10,
                      color: "#606168",
                    }}
                  >
                    {item.qtdQuestion}{" "}
                    {item.qtdQuestion > 1 ? "notificações" : "1 notificação"}
                  </Text>
                </View>
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
    backgroundColor: "#FF9096",
    paddingHorizontal: 24,
    paddingTop: 47,
    paddingBottom: 14,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: "MontserratAlternates_800ExtraBold",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 800,
    fontFamily: "PlusJakartaSans_700Bold",
  },
  appointmentItemTextDiv: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  divider: {
    marginTop: 16,
    height: 1,
    backgroundColor: "#E7E7E7",
    marginHorizontal: 24,
  },
  totalPacientesDiv: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  totalPacientesText: {
    flex: 1,
    alignItems: "flex-start",
  },
  totalPacientesTitle: {
    fontSize: 40,
    fontWeight: 800,
  },
  questionDiv: {
    marginTop: 34,
    paddingHorizontal: 24,
  },
  questionDivHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  questionDivBody: {
    marginTop: 16,
  },
  questionItemDiv: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: "100%",
    backgroundColor: "#EAF3FF",
    borderRadius: 12,
    gap: 8,
    marginBottom: 8,
  },
});
