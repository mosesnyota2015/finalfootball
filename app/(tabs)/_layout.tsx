import React from "react";
import { Tabs } from "expo-router";
import { colors } from "@/constants/colors";
import { ListFilter, Users, BarChart3, Settings } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inactive,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: 'white',
      }}
      initialRouteName="index"
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="players"
        options={{
          title: "Players",
          tabBarIcon: ({ color }) => <ListFilter size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="team"
        options={{
          title: "My Team",
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="results"
        options={{
          title: "Results",
          tabBarIcon: ({ color }) => <BarChart3 size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}