import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";

export default function ProfileScreen() {
  const { signOut, userToken } = useAuth();

  async function handleLogout() {
    await signOut();

    router.replace("/(auth)/login");
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* PAGE HEADER */}

        <View style={styles.pageHeader}>
          <View>
            <Text style={styles.smallTitle}>ACCOUNT</Text>

            <Text style={styles.title}>Profile</Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="person-outline"
              size={22}
              color="#73B4FF"
            />
          </View>
        </View>

        {/* PROFILE CARD */}

        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: "https://i.pravatar.cc/200",
              }}
              style={styles.avatar}
            />

            <View style={styles.onlineDot} />
          </View>

          <View style={styles.profileInformation}>
            <Text style={styles.name}>Toma Matei</Text>

            <Text style={styles.email}>
              toma@example.com
            </Text>
          </View>

          <Pressable style={styles.editButton}>
            <Ionicons
              name="pencil-outline"
              size={18}
              color="#80BCFF"
            />
          </Pressable>
        </View>

        {/* ACCOUNT STATUS */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Account
          </Text>

          <View style={styles.card}>
            <ProfileRow
              icon="person-outline"
              title="Personal information"
              subtitle="Name, email and profile picture"
            />

            <Divider />

            <ProfileRow
              icon="notifications-outline"
              title="Notifications"
              subtitle="Manage your preferences"
            />

            <Divider />

            <ProfileRow
              icon="shield-checkmark-outline"
              title="Privacy & security"
              subtitle="Password and account protection"
            />
          </View>
        </View>

        {/* APP */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Application
          </Text>

          <View style={styles.card}>
            <ProfileRow
              icon="color-palette-outline"
              title="Appearance"
              subtitle="Theme and interface"
            />

            <Divider />

            <ProfileRow
              icon="help-circle-outline"
              title="Help"
              subtitle="Support and information"
            />
          </View>
        </View>

        {/* SESSION */}

        <View style={styles.sessionCard}>
          <View>
            <Text style={styles.sessionLabel}>
              Session
            </Text>

            <Text style={styles.sessionStatus}>
              {userToken ? "Connected" : "Not connected"}
            </Text>
          </View>

          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: userToken
                  ? "#58D68D"
                  : "#E86A6A",
              },
            ]}
          />
        </View>

        {/* LOGOUT */}

        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Ionicons
            name="log-out-outline"
            size={21}
            color="#FF7777"
          />

          <Text style={styles.logoutText}>
            Sign out
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileRow({
  icon,
  title,
  subtitle,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}) {
  return (
    <Pressable style={styles.row}>
      <View style={styles.rowIcon}>
        <Ionicons
          name={icon}
          size={21}
          color="#75B5FF"
        />
      </View>

      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>
          {title}
        </Text>

        <Text style={styles.rowSubtitle}>
          {subtitle}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={19}
        color="#4E6078"
      />
    </Pressable>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#07111F",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 18,

    // important din cauza floating tab bar
    paddingBottom: 120,
  },

  pageHeader: {
    flexDirection: "row",

    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: 28,
  },

  smallTitle: {
    color: "#5D7592",

    fontSize: 11,
    fontWeight: "700",

    letterSpacing: 1.5,

    marginBottom: 5,
  },

  title: {
    color: "#F2F7FD",

    fontSize: 31,
    fontWeight: "700",

    letterSpacing: -0.7,
  },

  headerIcon: {
    width: 46,
    height: 46,

    justifyContent: "center",
    alignItems: "center",

    borderRadius: 15,

    backgroundColor: "#10243A",

    borderWidth: 1,
    borderColor: "#183451",
  },

  profileCard: {
    minHeight: 100,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#0C1929",

    borderWidth: 1,
    borderColor: "#17283C",

    borderRadius: 22,

    padding: 18,

    marginBottom: 30,
  },

  avatarWrapper: {
    position: "relative",
  },

  avatar: {
    width: 64,
    height: 64,

    borderRadius: 20,
  },

  onlineDot: {
    position: "absolute",

    right: -2,
    bottom: -2,

    width: 16,
    height: 16,

    borderRadius: 8,

    backgroundColor: "#58D68D",

    borderWidth: 3,
    borderColor: "#0C1929",
  },

  profileInformation: {
    flex: 1,

    marginLeft: 15,
  },

  name: {
    color: "#EFF5FC",

    fontSize: 18,
    fontWeight: "600",

    marginBottom: 4,
  },

  email: {
    color: "#728298",

    fontSize: 13,
  },

  editButton: {
    width: 40,
    height: 40,

    justifyContent: "center",
    alignItems: "center",

    borderRadius: 13,

    backgroundColor: "#11263D",
  },

  section: {
    marginBottom: 26,
  },

  sectionTitle: {
    color: "#7D8EA5",

    fontSize: 13,
    fontWeight: "600",

    marginLeft: 4,
    marginBottom: 11,
  },

  card: {
    backgroundColor: "#0C1929",

    borderWidth: 1,
    borderColor: "#17283C",

    borderRadius: 21,

    overflow: "hidden",
  },

  row: {
    minHeight: 76,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 16,
  },

  rowIcon: {
    width: 42,
    height: 42,

    justifyContent: "center",
    alignItems: "center",

    borderRadius: 13,

    backgroundColor: "#10243A",

    marginRight: 13,
  },

  rowText: {
    flex: 1,
  },

  rowTitle: {
    color: "#E4ECF6",

    fontSize: 15,
    fontWeight: "500",

    marginBottom: 4,
  },

  rowSubtitle: {
    color: "#65778E",

    fontSize: 12,
  },

  divider: {
    height: 1,

    backgroundColor: "#162638",

    marginLeft: 70,
  },

  sessionCard: {
    flexDirection: "row",

    justifyContent: "space-between",
    alignItems: "center",

    backgroundColor: "#0C1929",

    borderWidth: 1,
    borderColor: "#17283C",

    borderRadius: 18,

    paddingHorizontal: 18,
    paddingVertical: 15,

    marginBottom: 14,
  },

  sessionLabel: {
    color: "#7B8CA3",

    fontSize: 12,

    marginBottom: 3,
  },

  sessionStatus: {
    color: "#DDE7F3",

    fontSize: 14,
    fontWeight: "500",
  },

  statusDot: {
    width: 9,
    height: 9,

    borderRadius: 5,
  },

  logoutButton: {
    height: 58,

    flexDirection: "row",

    justifyContent: "center",
    alignItems: "center",

    gap: 9,

    backgroundColor: "#21151B",

    borderWidth: 1,
    borderColor: "#3B2028",

    borderRadius: 18,
  },

  logoutText: {
    color: "#FF7777",

    fontSize: 15,
    fontWeight: "600",
  },

  buttonPressed: {
    opacity: 0.75,
  },
});