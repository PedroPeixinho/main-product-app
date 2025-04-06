import { Tabs, useLocalSearchParams } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import  IconHome  from "@/assets/images/icon_home.svg";
import IconMouth from "../../assets/images/icon_mouth.svg";
import UserIcon from "../../assets/images/user_icon.svg";
import { FontAwesome } from "@expo/vector-icons";


export default function TabLayoutPaciente() {
  const colorScheme = useColorScheme();
  const { done } = useLocalSearchParams();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#006FFD",
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
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
          tabBarIcon: ({ color }) => (
            <IconHome width={24} height={24} fill={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="exercicios"
        options={{
          title: "Exercícios",
          tabBarIcon: ({ color }) => (
            <IconMouth width={24} height={24} fill={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="feedback"
        options={{
          title: "feedback",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="comments" size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <UserIcon width={22} height={22} fill={color} />
          ),
        }}
      />
    </Tabs>
  );
}
