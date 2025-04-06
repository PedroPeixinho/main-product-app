import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { PacienteService } from "@/services/pacientes";
import { useLocalSearchParams, useRouter } from "expo-router";
import WideButton from "@/components/wideButton";
import StatusFeito from "../../assets/images/statusFeito.svg";
import StatusMedia from "../../assets/images/statusMedia.svg";
import StatusNaoFeito from "../../assets/images/statusNaoFeito.svg";
import StatusReprovado from "../../assets/images/statusReprovado.svg";
import { ExerciseTag } from "@/components/ExerciseTagProps";

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
        
        <View style={styles.tabContent}>
          <Text style={styles.subtitle}>Desempenho</Text>
          <View style={styles.infoTextDivLine}>
            <Text>Ultimos 7 dias</Text>
            <Text style={styles.regularLabel}>REGULAR</Text>
          </View>
          <View style={styles.divider} />
          <Text style={styles.subtitleWithMargin}>Motricidade Orofacial</Text>
          <View style={{ flexDirection: "column", gap: 8 }}>
            <ExerciseTag
              label="ÓTIMO"
              exerciseName="Lateralizar"
              labelColor="#4CAF50"
            />
            <ExerciseTag
              label="BAIXO"
              exerciseName="Protruir e retrair"
              labelColor="#FDA400"
            />
            <ExerciseTag
              label="ÓTIMO"
              exerciseName="Inflar e Desinflar"
              labelColor="#4CAF50"
            />
            <ExerciseTag
              label="REGULAR"
              exerciseName="Boca de Peixe"
              labelColor="#FF9096"
            />
          </View>

          <Text style={styles.subtitleWithMargin}>Frequencia</Text>
          <View style={styles.infoTextDivLine}>
            <Text>Ultimos 7 dias</Text>
            <View style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 40,
                justifyContent: "space-between",
            }}>
              <Text style={{ fontWeight: "bold"}}>60%</Text>
              <Text style={styles.regularLabel}>REGULAR</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View
              style={{
                margin: "5%",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              {renderDaysOfWeek(today)}
          </View>
          <View style={styles.divider} />
          <View style={styles.infoTextDivLine}>
            <Text>Ultimo mês</Text>
            <View style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 40,
                justifyContent: "space-between",
            }}>
              <Text style={{ fontWeight: "bold"}}>85%</Text>
              <Text style={styles.bomLabel}>BOM</Text>
            </View>
          </View>
          <View style={styles.infoTextDivLine}>
            <Text>Ultimos 3 meses</Text>
            <View style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 40,
                justifyContent: "space-between",
            }}>
              <Text style={{ fontWeight: "bold"}}>75%</Text>
              <Text style={styles.bomLabel}>BOM</Text>
            </View>
          </View>
          <View style={styles.infoTextDivLine}>
            <Text>Tratamento completo</Text>
            <View style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 40,
                justifyContent: "space-between",
            }}>
              <Text style={{ fontWeight: "bold"}}>80%</Text>
              <Text style={styles.bomLabel}>BOM</Text>
            </View>
          </View>

        </View>
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
  subtitleWithMargin: {
    marginTop: 16,
    marginBottom: 10,
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
    marginHorizontal: "1%",
  },
  infoTextDivLine: {
    alignItems: "center",
    marginTop: 16,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
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
  regularLabel: {
    backgroundColor: "#FF9096",
    color: "white",
    padding: 8,
    borderRadius: 50,
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 10,
  },
  bomLabel: {
    backgroundColor: "#006FFD",
    color: "white",
    padding: 8,
    borderRadius: 50,
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 10,
  },
});
