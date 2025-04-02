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
import FloatingAction from "@/components/FloatingActionButton";
import { PacienteService } from "@/services/pacientes";

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
  const [selectedStatus, setSelectedStatus] = useState<string>("todos");
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
        console.error("Error fetching patients:", error);
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
    <>
      <View style={styles.floatingActionButton}>
        <FloatingAction
          onPress={() => {
            router.navigate("../patientProfile/patientProfile");
          }}
        />
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Pacientes</Text>
        </View>
        <View style={styles.body}>
          <View style={styles.divider} />
          <View style={styles.searchBarDiv}>
            <TextInput
              style={styles.input}
              onChangeText={filterPatients}
              value={searchNomePaciente}
              placeholder="Pesquise"
              keyboardType="default"
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ flexDirection: "row" }}
            >
              {["todos", "emAcompanhamento", "emAvaliacao", "concluido"].map(
                (status) => (
                  <TouchableOpacity
                    key={status}
                    style={{
                      marginRight: 8,
                    }}
                  >
                    <Text
                      style={{
                        padding: 8,
                        borderRadius: 16,
                        backgroundColor:
                          selectedStatus === status ? "#006FFD" : "#EAF2FF",
                        color: selectedStatus === status ? "#fff" : "#006FFD",
                        fontWeight: "bold",
                        marginTop: 16,
                      }}
                      onPress={() => {
                        setSearchNomePaciente("");
                        setSelectedStatus(status);
                        setFilteredPatients(
                          status === "todos"
                            ? patients
                            : patients.filter(
                                (patient) => patient.status === status
                              )
                        );
                      }}
                    >
                      {status === "todos"
                        ? "Todos"
                        : status === "emAcompanhamento"
                          ? "Em acompanhamento"
                          : status === "emAvaliacao"
                            ? "Em avaliação"
                            : "Concluídos"}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </ScrollView>
          </View>
          <View style={styles.divider} />
          <View style={styles.pacientesDiv}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              {filteredPatients.length} resultados
            </Text>
            {filteredPatients.map((item) => (
              <TouchableOpacity
                style={styles.patientItemDiv}
                key={item.id}
                onPress={() => {
                  router.navigate("../patientProfile/patientProfile");
                }}
              >
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
                <View>
                  <Text
                    style={{
                      color: "#50525A",
                      fontWeight: 600,
                    }}
                  >
                    {item.nome}
                  </Text>
                  <View style={styles.patientItemSubTextDiv}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#50525A",
                      }}
                    >
                      {
                        [
                          "Domingos",
                          "Segundas",
                          "Terças",
                          "Quartas",
                          "Quintas",
                          "Sextas",
                          "Sábados",
                        ][item.diaConsulta]
                      }
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#50525A",
                      }}
                    >
                      |
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#50525A",
                      }}
                    >
                      {item.horarioConsulta}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
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
    fontWeight: 900,
  },
  searchBarDiv: {
    marginTop: 16,
  },
  filters: {
    flexDirection: "row",
    marginTop: 16,
  },
  divider: {
    marginTop: 16,
    height: 1,
    backgroundColor: "#E7E7E7",
  },
  input: {
    backgroundColor: "#F8F9FE",
    borderRadius: 24,
    padding: 16,
  },
  pacientesDiv: {
    marginTop: 16,
  },
  patientItemDiv: {
    flexDirection: "row",
    gap: 16,
    padding: 16,
    backgroundColor: "#F8F9FE",
    borderRadius: 24,
    marginTop: 16,
  },
  patientItemSubTextDiv: {
    flexDirection: "row",
    gap: 8,
  },
  floatingActionButton: {
    position: "absolute",
    right: 56,
    bottom: 56,
    zIndex: 1,
  },
});
