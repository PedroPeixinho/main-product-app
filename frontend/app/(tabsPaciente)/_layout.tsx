import { Tabs, useLocalSearchParams } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { FontAwesome, Ionicons, Feather } from "@expo/vector-icons";
import IconMouth from "../../assets/images/icon_mouth.svg";
import UserIcon from "../../assets/images/user_icon.svg";
import { MaterialIcons } from '@expo/vector-icons';

export default function TabLayoutPaciente() {
  const colorScheme = useColorScheme();
  const { done } = useLocalSearchParams();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#006FFD",
        tabBarInactiveTintColor: "#8CBEFF",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="homePaciente"
        options={{
          title: "Início",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="home"
              size={24}
              color={focused ? "#006FFD" : "#8CBEFF"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="exercicios"
        options={{
          title: "Exercícios",
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="emoji-people"
              size={24}
              color={focused ? "#006FFD" : "#8CBEFF"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="feedback"
        options={{
          title: "Feedback",
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="comments"
              size={22}
              color={focused ? "#006FFD" : "#8CBEFF"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="user"
              size={22}
              color={focused ? "#006FFD" : "#8CBEFF"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
