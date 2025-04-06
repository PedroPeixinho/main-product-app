import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useColorScheme } from "@/hooks/useColorScheme";
import UserIcon from "../../assets/images/user_icon.svg";
import { FontAwesome } from "@expo/vector-icons";

const ACTIVE_COLOR = "#006FFD";
const INACTIVE_COLOR = "#8CBEFF";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
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
        name="home"
        options={{
          title: "Início",
          tabBarIcon: ({ focused }) => (
            <IconSymbol
              size={28}
              name="house.fill"
              color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Pacientes",
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="people"
              size={24}
              color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="duvidas"
        options={{
          title: "Dúvidas",
          tabBarIcon: ({ focused }) => (
            <FontAwesome
              name="comments"
              size={22}
              color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
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
              color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
          ),
        }}
      />
    </Tabs>
  );
}
