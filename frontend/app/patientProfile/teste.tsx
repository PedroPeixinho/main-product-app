import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";

export default function Teste() {
  const router = useRouter();
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={24} color="#006FFD" />
        </TouchableOpacity>
        <Text style={styles.title}>Paciente</Text>
        <Text></Text>
      </View>
      <View style={styles.body}>
        <View style={styles.profileBannerDiv}>
          <Image
            style={{ width: 52, height: 52, borderRadius: 25 }}
            source={{
              uri: "https://avatars.githubusercontent.com/u/55458349?v=4",
            }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 8,
            }}
          >
            <View
              style={{
                gap: 8,
              }}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#50525A",
                }}
              >
                Ana Bolena de Almeida Gonçalves
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "#50525A",
                }}
              >
                Terças | 14h
              </Text>
            </View>
            <Entypo name="dots-three-vertical" size={20} color="black" />
          </View>
        </View>
        <View style={styles.divider} />
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 24,
    paddingTop: 47,
    paddingBottom: 14,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
  },
  divider: {
    marginTop: 16,
    height: 1,
    backgroundColor: "#E7E7E7",
  },
  body: {
    paddingHorizontal: 24,
  },
  profileBannerDiv: {
    height: 52,
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 24,
    gap: 16,
  },
});
