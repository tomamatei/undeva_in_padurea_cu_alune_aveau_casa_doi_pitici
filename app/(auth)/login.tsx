import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useAuth } from "../../contexts/AuthContext";

export default function LoginScreen() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    try {
      await signIn("demo-token");

      router.replace("/(tabs)/home");
    } catch (error) {
      console.log("Login error:", error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.content}>
          
          {/* TITLE */}

          <View style={styles.header}>
            <Text style={styles.title}>Welcome back</Text>

            <Text style={styles.subtitle}>
              Sign in and continue where you left off.
            </Text>
          </View>

          {/* FORM */}

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#708198"
                  style={styles.inputIcon}
                />

                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  placeholderTextColor="#526175"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>

              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#708198"
                  style={styles.inputIcon}
                />

                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#526175"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />

                <Pressable
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#708198"
                  />
                </Pressable>
              </View>
            </View>

            {/* LOGIN BUTTON */}

            <Pressable
              style={({ pressed }) => [
                styles.loginButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>Sign in</Text>

              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </Pressable>
          </View>

          {/* REGISTER */}

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Don't have an account?
            </Text>

            <Pressable
              onPress={() => router.push("/(auth)/register")}
            >
              <Text style={styles.registerLink}>Create account</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07111F",
  },

  keyboardView: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
    justifyContent: "center",
  },

  logoContainer: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: 48,
  },

  logo: {
    width: 44,
    height: 44,

    borderRadius: 14,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#10243A",

    marginRight: 12,
  },

  logoText: {
    color: "#EAF3FF",

    fontSize: 17,
    fontWeight: "600",
  },

  header: {
    marginBottom: 38,
  },

  title: {
    color: "#F4F8FD",

    fontSize: 34,
    fontWeight: "700",

    letterSpacing: -0.8,

    marginBottom: 10,
  },

  subtitle: {
    color: "#8795A9",

    fontSize: 16,
    lineHeight: 24,
  },

  form: {
    gap: 20,
  },

  inputGroup: {
    gap: 9,
  },

  label: {
    color: "#BBC7D7",

    fontSize: 14,
    fontWeight: "500",
  },

  inputContainer: {
    height: 58,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#0D1A2A",

    borderWidth: 1,
    borderColor: "#16263A",

    borderRadius: 17,

    paddingHorizontal: 16,
  },

  inputIcon: {
    marginRight: 12,
  },

  input: {
    flex: 1,

    height: "100%",

    color: "#EAF3FF",

    fontSize: 16,
  },

  eyeButton: {
    padding: 8,
  },

  loginButton: {
    height: 58,

    flexDirection: "row",

    justifyContent: "center",
    alignItems: "center",

    gap: 10,

    marginTop: 8,

    backgroundColor: "#2878D7",

    borderRadius: 17,
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },

  loginButtonText: {
    color: "#FFFFFF",

    fontSize: 16,
    fontWeight: "600",
  },

  registerContainer: {
    flexDirection: "row",

    justifyContent: "center",
    alignItems: "center",

    gap: 6,

    marginTop: 32,
  },

  registerText: {
    color: "#77869B",

    fontSize: 14,
  },

  registerLink: {
    color: "#64ABFF",

    fontSize: 14,
    fontWeight: "600",
  },
});