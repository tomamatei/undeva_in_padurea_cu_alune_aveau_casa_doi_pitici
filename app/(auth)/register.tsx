import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";


export default function RegisterScreen() {
  const { signIn} = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  async function handleRegister() {
    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return;
    }

    try {
      await signIn("demo-token");

      router.replace("/(tabs)/home");
    } catch (error) {
      console.log("Register error:", error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* BACK */}

          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#C5D2E2"
            />
          </Pressable>

          {/* HEADER */}

          <View style={styles.header}>
            <Text style={styles.title}>Create your account</Text>

            <Text style={styles.subtitle}>
              Set up your profile and start building your personalized
              experience.
            </Text>
          </View>

          {/* FORM */}

          <View style={styles.form}>
            <InputField
              label="Name"
              placeholder="Your name"
              icon="person-outline"
              value={name}
              onChangeText={setName}
            />

            <InputField
              label="Email"
              placeholder="you@example.com"
              icon="mail-outline"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

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
                  placeholder="Create a password"
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
                    name={
                      showPassword
                        ? "eye-off-outline"
                        : "eye-outline"
                    }
                    size={20}
                    color="#708198"
                  />
                </Pressable>
              </View>
            </View>

            <InputField
              label="Confirm password"
              placeholder="Repeat your password"
              icon="shield-checkmark-outline"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
            />

            <Pressable
              style={({ pressed }) => [
                styles.registerButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleRegister}
            >
              <Text style={styles.registerButtonText}>
                Create account
              </Text>

              <Ionicons
                name="arrow-forward"
                size={20}
                color="#FFFFFF"
              />
            </Pressable>
          </View>

          {/* LOGIN */}

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              Already have an account?
            </Text>

            <Pressable
              onPress={() => router.replace("/(auth)/login")}
            >
              <Text style={styles.loginLink}>Sign in</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function InputField({
  label,
  icon,
  ...props
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  [key: string]: any;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputContainer}>
        <Ionicons
          name={icon}
          size={20}
          color="#708198"
          style={styles.inputIcon}
        />

        <TextInput
          {...props}
          style={styles.input}
          placeholderTextColor="#526175"
        />
      </View>
    </View>
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

  scrollContent: {
    flexGrow: 1,

    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,

    justifyContent: "center",
  },

  backButton: {
    width: 44,
    height: 44,

    borderRadius: 14,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#0D1A2A",

    borderWidth: 1,
    borderColor: "#16263A",

    marginBottom: 30,
  },

  header: {
    marginBottom: 34,
  },

  logo: {
    width: 50,
    height: 50,

    borderRadius: 16,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#10243A",

    marginBottom: 22,
  },

  title: {
    color: "#F4F8FD",

    fontSize: 32,
    fontWeight: "700",

    letterSpacing: -0.7,

    marginBottom: 10,
  },

  subtitle: {
    color: "#8795A9",

    fontSize: 15,
    lineHeight: 23,
  },

  form: {
    gap: 18,
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

  registerButton: {
    height: 58,

    flexDirection: "row",

    justifyContent: "center",
    alignItems: "center",

    gap: 10,

    backgroundColor: "#2878D7",

    borderRadius: 17,

    marginTop: 10,
  },

  registerButtonText: {
    color: "#FFFFFF",

    fontSize: 16,
    fontWeight: "600",
  },

  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },

  loginContainer: {
    flexDirection: "row",

    justifyContent: "center",
    alignItems: "center",

    gap: 6,

    marginTop: 28,
  },

  loginText: {
    color: "#77869B",

    fontSize: 14,
  },

  loginLink: {
    color: "#64ABFF",

    fontSize: 14,
    fontWeight: "600",
  },
});