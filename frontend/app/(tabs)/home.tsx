import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { PacienteService } from "@/services/pacientes";

interface Appointment {
  id: string;
  nomePaciente: string;
  hour: string;
}

interface Question {
  avatarUrl?: string;
  id: string;
  nomePaciente: string;
  hour: string;
  data: Date;
  qtdQuestion: number;
}

export default function Home() {
  const [name, setName] = useState("Tuany");
  const [nextAppointmentDate, setNextAppointmentDate] = useState<Date>();
  const [appointmentsToday, setAppointmentsToday] = useState<Appointment[]>([]);
  const [question, setQuestion] = useState<Question[]>([]);
  const [totalPatients, setTotalPatients] = useState();
  const [patientsInEvaluation, setPatientsInEvaluation] = useState();
  const [patientsInTreatment, setPatientsInTreatment] = useState(3);
  const [patientsConcluded, setPatientsConcluded] = useState();

  useEffect(() => {
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

    const fetchPatients = async () => {
      try {
        const response = await PacienteService.getPacientes();
        setTotalPatients(response.length);
        setPatientsInEvaluation(
          response.filter((patient: any) => patient.status === "emAvaliacao")
            .length
        );
        setPatientsConcluded(
          response.filter((patient: any) => patient.status === "concluido")
            .length
        );
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    const fetchConsults = async () => {
      try {
        const response = await PacienteService.getConsultas();
        const temp: any = response.map((consulta: any) => ({
          id: consulta.id,
          nomePaciente: consulta.nome,
          hour: new Date(consulta.data_hora).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          date: new Date(consulta.data_hora),
        }));

        const minDate = temp.reduce(
          (min: any, current: any) => (current.date < min ? current.date : min),
          temp[0].date
        );

        const filteredAppointments = temp.filter(
          (appointment: any) =>
            appointment.date.toDateString() === minDate.toDateString()
        );

        setAppointmentsToday(filteredAppointments);

        setNextAppointmentDate(new Date(response[0].data_hora));
        setAppointmentsToday(filteredAppointments);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchConsults();
    fetchPatients();
    fetchQuestion();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Olá, {name}!</Text>
      </View>
      <View style={styles.appointmentDiv}>
        <View style={styles.appointmentDivHeader}>
          <Text style={styles.subtitle}>Agendamentos</Text>
          {nextAppointmentDate && (
            <Text style={styles.secondarySubtitle}>
              {
                [
                  "Domingo",
                  "Segunda-feira",
                  "Terça-feira",
                  "Quarta-feira",
                  "Quinta-feira",
                  "Sexta-feira",
                  "Sábado",
                ][nextAppointmentDate.getDay()]
              }
              ,
              {` ${nextAppointmentDate.getDate().toString().padStart(2, "0")}/${(nextAppointmentDate.getMonth() + 1).toString().padStart(2, "0")}/${nextAppointmentDate.getFullYear()}`}
            </Text>
          )}
        </View>
        <View style={styles.appointmentDivBody}>
          {appointmentsToday.map((item) => (
            <View key={item.id} style={styles.appointmentItemDiv}>
              <View style={styles.appointmentItemTextDiv}>
                <Text>{item.hour}</Text>
                <Text>|</Text>
                <Text>{item.nomePaciente}</Text>
              </View>
              <TouchableOpacity>
                <Entypo name="dots-three-vertical" size={12} color="black" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <View style={styles.appointmentDivFooter}>
          <TouchableOpacity
            onPress={() => {
              console.log("oxe");
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 12 }}>
              + Novo agendamento
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.patientsDiv}>
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Total de pacientes
            </Text>
            <Text
              style={{
                fontSize: 40,
                fontWeight: "bold",
              }}
            >
              {totalPatients}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              gap: 8,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text>Em avaliação</Text>
              <Text
                style={{
                  fontWeight: "bold",
                }}
              >
                {patientsInEvaluation}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text>Em acompanhamento</Text>
              <Text
                style={{
                  fontWeight: "bold",
                }}
              >
                {patientsInTreatment}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text>Concluídos</Text>
              <Text
                style={{
                  fontWeight: "bold",
                }}
              >
                {patientsConcluded}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.patientsDivFooter}>
          <TouchableOpacity
            onPress={() => {
              console.log("oxe");
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 12 }}>
              + Cadastrar paciente
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.questionDiv}>
        <View style={styles.questionDivHeader}>
          <Text style={styles.subtitle}>Últimas dúvidas</Text>
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
                  }}
                >
                  <Text
                    style={{
                      color: "#50525A",
                      fontSize: 12,
                    }}
                  >{`${item.data.getDate().toString().padStart(2, "0")}/${(item.data.getMonth() + 1).toString().padStart(2, "0")}/${item.data.getFullYear()}`}</Text>
                  <Text
                    style={{
                      color: "#50525A",
                      fontSize: 12,
                    }}
                  >
                    |
                  </Text>
                  <Text
                    style={{
                      color: "#50525A",
                      fontSize: 12,
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
                      backgroundColor: "black",
                    }}
                  />
                  <Text>
                    {item.qtdQuestion}{" "}
                    {item.qtdQuestion > 1 ? "dúvidas" : "dúvida"}
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
    backgroundColor: "#CCE2FF",
    paddingHorizontal: 24,
    paddingTop: 47,
    paddingBottom: 14,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 900,
  },
  appointmentDiv: {
    marginTop: 34,
    paddingHorizontal: 24,
  },
  appointmentDivHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  appointmentDivBody: {
    marginTop: 16,
  },
  appointmentDivFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
    width: "100%",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 800,
  },
  secondarySubtitle: {
    fontSize: 16,
    fontWeight: 800,
    color: "#9A9A9A",
  },
  appointmentItemDiv: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: "100%",
    backgroundColor: "#F8F9FE",
    borderRadius: 12,
    marginBottom: 8,
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
  patientsDiv: {
    marginTop: 16,
    paddingHorizontal: 24,
  },
  patientsDivFooter: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
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
    backgroundColor: "#F8F9FE",
    borderRadius: 12,
    gap: 8,
    marginBottom: 8,
  },
});
