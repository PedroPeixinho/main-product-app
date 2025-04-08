import { View, Text, StyleSheet, Image } from "react-native";
import { useEffect, useState } from "react";
import { PacienteService } from "@/services/pacientes";
import { useLocalSearchParams, useRouter } from "expo-router";
import WideButton from "@/components/wideButton";
import StatusFeito from "../../assets/images/statusFeito.svg";
import StatusMedia from "../../assets/images/statusMedia.svg";
import StatusNaoFeito from "../../assets/images/statusNaoFeito.svg";
import StatusReprovado from "../../assets/images/statusReprovado.svg";
import Baloon from "../../assets/images/baloon.svg";
import Mouth from "../../assets/images/mouth.svg";
import { Platform } from "react-native";

interface Question {
  avatarUrl?: string;
  id: string;
  nomePaciente: string;
  hour: string;
  data: Date;
  qtdQuestion: number;
}

export default function Exercicios() {
  const { done } = useLocalSearchParams();
  const [selectedTab, setSelectedTab] = useState("Início");
  const router = useRouter();
  const [isDone, setIsDone] = useState(done === "1");
  const [date, setDate] = useState(new Date());
  const [today, setToday] = useState(new Date().getDay());
  const [name, setName] = useState("Maiara");
  const [question, setQuestion] = useState<Question[]>([]);
  const [qtdPatients, setQtdPatients] = useState<number>(0);

  const renderDaysOfWeek = (lastDayIndex: number) => {
    let daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

    daysOfWeek = [
      ...daysOfWeek.slice(lastDayIndex + 1),
      ...daysOfWeek.slice(0, lastDayIndex + 1),
    ];

    return daysOfWeek.map((day, index) => (
      <View
        key={index}
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontFamily: "PlusJakartaSans_400Regular",
            color: index === today ? "#000" : "#50525A",
            fontWeight: index === today ? "bold" : "normal",
          }}
        >
          {day}
        </Text>
        {index == 0 || index == 3 || index == 4 || index == 5 ? (
          <StatusFeito width={24} height={24} />
        ) : index == 1 ? (
          <StatusReprovado width={24} height={24} />
        ) : index == 2 ? (
          <StatusMedia width={24} height={24} />
        ) : isDone ? (
          <StatusFeito width={24} height={24} />
        ) : (
          <StatusNaoFeito width={24} height={24} />
        )}
      </View>
    ));
  };

  useEffect(() => {
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
        console.log("Error fetching patients:", error);
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
        console.log("Error fetching patients:", error);
      }
    };

    fetchQuestion();
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={{
          marginTop: 60,
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 20,
              fontFamily: "MontserratAlternates_800ExtraBold",
              color: "#006FFD",
            }}
          >
            Exercicios
          </Text>
        </View>
        <View style={styles.divider} />
        <View>
          <Text
            style={{
              marginTop: 8,
              fontSize: 16,
              fontFamily: "PlusJakartaSans_500Medium",
              color: "#3B3B3B",
            }}
          >
            {date.toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </Text>
          <View
            style={{
              marginTop: 24,
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: 24,
            }}
          >
            {renderDaysOfWeek(today)}
          </View>
          <Baloon
            width="100%"
            style={{
              marginTop: 8,
            }}
          />
        </View>
        <View>
          <Text
            style={{
              marginTop: 24,
              fontSize: 14,
              fontFamily: "PlusJakartaSans_800ExtraBold",
              color: "#006FFD",
            }}
          >
            Motricidade orofacial
          </Text>
          <View
            style={{
              marginTop: 8,
              gap: 8,
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderWidth: 2,
                borderColor: "#FF9096",
                padding: 10,
                borderRadius: 45,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: 16,
                  alignItems: "center",
                }}
              >
                <Mouth width={35} height={35} />
                <Text
                  style={{
                    fontFamily: "PlusJakartaSans_600SemiBold",
                    color: "#000000",
                    fontSize: 14,
                  }}
                >
                  Lateralizar
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "#006FFD",
                  borderRadius: 45,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                }}
              >
                <Text
                  style={{
                    fontFamily: "PlusJakartaSans_600SemiBold",
                    color: "#FFFFFF",
                    fontSize: 10,
                  }}
                >
                  1 x 10
                </Text>
              </View>
            </View>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderWidth: 2,
                borderColor: "#FF9096",
                padding: 10,
                borderRadius: 45,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: 16,
                  alignItems: "center",
                }}
              >
                <Mouth width={35} height={35} />
                <Text
                  style={{
                    fontFamily: "PlusJakartaSans_600SemiBold",
                    color: "#000000",
                    fontSize: 14,
                  }}
                >
                  Protruir e retrair
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "#006FFD",
                  borderRadius: 45,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                }}
              >
                <Text
                  style={{
                    fontFamily: "PlusJakartaSans_600SemiBold",
                    color: "#FFFFFF",
                    fontSize: 10,
                  }}
                >
                  1 x 10
                </Text>
              </View>
            </View>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderWidth: 2,
                borderColor: "#FF9096",
                padding: 10,
                borderRadius: 45,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: 16,
                  alignItems: "center",
                }}
              >
                <Mouth width={35} height={35} />
                <Text
                  style={{
                    fontFamily: "PlusJakartaSans_600SemiBold",
                    color: "#000000",
                    fontSize: 14,
                  }}
                >
                  Inflar e desinflar
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "#006FFD",
                  borderRadius: 45,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                }}
              >
                <Text
                  style={{
                    fontFamily: "PlusJakartaSans_600SemiBold",
                    color: "#FFFFFF",
                    fontSize: 10,
                  }}
                >
                  1 x 10
                </Text>
              </View>
            </View>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderWidth: 2,
                borderColor: "#FF9096",
                padding: 10,
                borderRadius: 45,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: 16,
                  alignItems: "center",
                }}
              >
                <Mouth width={35} height={35} />
                <Text
                  style={{
                    fontFamily: "PlusJakartaSans_600SemiBold",
                    color: "#000000",
                    fontSize: 14,
                  }}
                >
                  Boca de peixe
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: "#006FFD",
                  borderRadius: 45,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                }}
              >
                <Text
                  style={{
                    fontFamily: "PlusJakartaSans_600SemiBold",
                    color: "#FFFFFF",
                    fontSize: 10,
                  }}
                >
                  1 x 10
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View
        style={{
          marginBottom: Platform.OS === "ios" ? 114 : 14,
        }}
      >
        <WideButton
          text="Vamos Praticar?"
          onPress={() => {
            router.push({
              pathname: "../iniciarExercicio",
              params: { id_exercicio: 1 },
            }); //MUDAR ROTA
          }}
          variant="noIcon"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
    justifyContent: "space-between",
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
    backgroundColor: "#8CBEFF",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    // backgroundColor: "#E7E7E7",
  },
  activeTab: {
    backgroundColor: "#006FFD",
  },
  tabText: {
    fontSize: 14,
    color: "#50525A",
  },
  activeTabText: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
  activeTabLine: {
    marginTop: 6,
    height: 6,
    width: "100%",
    backgroundColor: "#006FFD",
    borderRadius: 3,
  },
  tabContent: {
    marginTop: 16,
    marginHorizontal: 24,
  },
});
