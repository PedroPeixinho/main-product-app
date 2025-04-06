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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pacientes</Text>
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
              placeholder="Pesquise"
              keyboardType="default"
            />
          </View>
          <WideButton
            text="Cadastrar paciente"
            onPress={() => {
              router.navigate("../patient/new_patient");
            }}
          />
        </View>
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
              <View
                style={{
                  flex: 1,
                  gap: 4,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#50525A",
                    fontFamily: "PlusJakartaSans_600SemiBold",
                  }}
                >
                  {item.nome}
                </Text>
                <View style={styles.patientItemSubTextDiv}>
                  <Text
                    style={{
                      color: "#50525A",
                      fontSize: 12,
                      fontFamily: "PlusJakartaSans_400Regular",
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
                    {item.horarioConsulta}
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
    marginTop: 16,
    height: 1,
    backgroundColor: "#E7E7E7",
  },

  pacientesDiv: {
    marginTop: 16,
  },
  patientItemDiv: {
    flexDirection: "row",
    gap: 16,
    padding: 16,
    backgroundColor: "#EAF3FF",
    borderRadius: 24,
    marginTop: 16,
  },
  patientItemSubTextDiv: {
    flexDirection: "row",
    gap: 8,
  },
});
