import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { PacienteService } from "@/services/pacientes";
import { useLocalSearchParams, useRouter } from "expo-router";
import WideButton from "@/components/wideButton";

interface Question {
  avatarUrl?: string;
  id: string;
  nomePaciente: string;
  hour: string;
  data: Date;
  qtdQuestion: number;
}

export default function HomePaciente() {
  const { done } = useLocalSearchParams();
  const [selectedTab, setSelectedTab] = useState("Início");
  const router = useRouter();
  const [isDone, setIsDone] = useState(done === "1");
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
          <Image
            style={{
              width: 24,
              height: 24,
            }}
            source={require(`../../assets/images/statusFeito.svg`)}
          />
        ) : index == 1 ? (
          <Image
            style={{
              width: 24,
              height: 24,
            }}
            source={require(`../../assets/images/statusReprovado.svg`)}
          />
        ) : index == 2 ? (
          <Image
            style={{
              width: 24,
              height: 24,
            }}
            source={require(`../../assets/images/statusMedia.svg`)}
          />
        ) : isDone ? (
          <Image
            style={{
              width: 24,
              height: 24,
            }}
            source={require(`../../assets/images/statusFeito.svg`)}
          />
        ) : (
          <Image
            style={{
              width: 24,
              height: 24,
            }}
            source={require(`../../assets/images/statusNaoFeito.svg`)}
          />
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
      <View style={styles.tabs}>
        {["Início", "Progresso"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.tab}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
            {selectedTab === tab && <View style={styles.activeTabLine} />}
          </TouchableOpacity>
        ))}
      </View>
      {selectedTab === "Início" ? (
        <View style={styles.tabContent}>
          <View
            style={{
              marginTop: 16,
              gap: 8,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "PlusJakartaSans_700Bold",
              }}
            >
              Diagnóstico
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "PlusJakartaSans_400Regular",
                color: "#50525A",
              }}
            >
              Disfunção Temporomandibular
            </Text>
          </View>
          <View
            style={{
              marginTop: 16,
              gap: 16,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "PlusJakartaSans_700Bold",
              }}
            >
              Frequência dos exercícios
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              {renderDaysOfWeek(today)}
            </View>
            <WideButton
              text="Vamos Praticar?"
              onPress={() => {
                router.push({
                  pathname: "/(tabsPaciente)/exercicios",
                  params: { done: isDone ? "1" : "0" },
                });
              }}
              variant="noIcon"
            />
          </View>
        </View>
      ) : (
        <View style={styles.tabContent}>progresso</View>
      )}
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
