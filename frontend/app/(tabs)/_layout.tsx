import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import UserIcon from "../../assets/images/user_icon.svg";
import { FontAwesome } from "@expo/vector-icons";


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
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
        name="home"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Pacientes",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="people" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
      name="duvidas"
      options={{
        title: "duvidas",
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
