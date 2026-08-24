import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarShowLabel: false,

        tabBarStyle: styles.tabBar,

        tabBarItemStyle: styles.tabBarItem,

        tabBarActiveTintColor: "#5EA8FF",
        tabBarInactiveTintColor: "#6F7C91",

        sceneStyle: {
          backgroundColor: "#07111F",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",

          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.activeIconContainer,
              ]}
            >
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={23}
                color={color}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",

          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.activeIconContainer,
              ]}
            >
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={23}
                color={color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",

    left: 20,
    right: 20,
    bottom: 18,

    height: 68,

    paddingTop: 8,
    paddingBottom: 8,

    backgroundColor: "#0C1828",

    borderTopWidth: 0,

    borderRadius: 24,

    elevation: 15,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 14,
  },

  tabBarItem: {
    height: 52,
  },

  iconContainer: {
    width: 46,
    height: 46,

    justifyContent: "center",
    alignItems: "center",

    borderRadius: 16,
  },

  activeIconContainer: {
    backgroundColor: "#142A44",
  },
});