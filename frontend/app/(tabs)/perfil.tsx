import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { getUserDetails, logout } from "@/services/auth";

interface User {
  cpf: string;
  nome: string;
}

export default function PatientProfile() {
  const router = useRouter();
  const [patientName, setPatientName] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false); // novo estado

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDetails = await getUserDetails();
        setUser(userDetails);
        if (userDetails?.cpf) setPatientName(userDetails.nome);
      } catch (error) {
        console.log("Erro ao buscar detalhes do usuário:", error);
      }
    };

    fetchUser();
  }, []);

  const confirmLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header} />

        <View style={styles.body}>
          <View style={styles.profileBannerDiv}>
            <View style={{ alignItems: "center", gap: 10 }}>
              <Image
                style={{ width: 90, height: 90, borderRadius: 100 }}
                source={require("../../assets/images/Maiara.png")}
              />
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "#1F2024",
                  fontFamily: "PlusJakartaSans_700Bold",
                }}
              >
                {patientName || "Carregando..."}
              </Text>
              <Text style={{ fontSize: 16, marginTop: -8, color: "#50525A" }}>
                5 anos
              </Text>
              <Text style={{ fontSize: 16, marginTop: 5, color: "#50525A" }}>
                Fonoaudióloga
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setShowModal(true)}
          >
            <Feather name="log-out" size={20} color="#006FFD" />
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>

          <View style={styles.divider} />
        </View>
      </ScrollView>

      {/* Modal customizado */}
      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Tem certeza que deseja sair?</Text>

            <TouchableOpacity
              style={styles.logoutConfirmButton}
              onPress={confirmLogout}
            >
              <Text style={styles.logoutConfirmText}>Sair</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.cancelText}>Voltar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 24,
    paddingTop: 47,
    paddingBottom: 14,
  },
  divider: {
    marginTop: 11,
    height: 1,
    backgroundColor: "#E7E7E7",
    width: "100%",
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  profileBannerDiv: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    width: "100%",
  },
  logoutText: {
    fontSize: 16,
    marginLeft: 12,
    color: "#1F2024",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: 300,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: "#1F2024",
  },
  logoutConfirmButton: {
    backgroundColor: "#006FFD",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  logoutConfirmText: {
    color: "#fff",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#FF9096",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: "100%",
    alignItems: "center",
  },
  cancelText: {
    color: "#fff",
    fontSize: 16,
  },
});
