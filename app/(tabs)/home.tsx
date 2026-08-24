import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
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

/*
  Later, these types should ideally be moved into separate files.

  A plan can contain whatever UI description your backend/AI returns.
*/
type Plan = {
  id: string;
  title: string;
  description?: string;
  createdAt: string;

  /*
    This will eventually contain the JSON structure
    returned by your backend for dynamic rendering.
  */
  content?: DynamicNode[];
};

type DynamicNode = {
  id: string;
  type: string;
  props?: Record<string, any>;
  children?: DynamicNode[];
};

/*
  Temporary mock plans.

  Later these should come from your server/database.
*/
const INITIAL_PLANS: Plan[] = [
  {
    id: "1",
    title: "Gym routine",
    description: "Weekly training and recovery plan",
    createdAt: "Today",
  },
  {
    id: "2",
    title: "Exam preparation",
    description: "Study schedule and milestones",
    createdAt: "Yesterday",
  },
  {
    id: "3",
    title: "Weekend trip",
    description: "Activities and travel organization",
    createdAt: "Aug 18",
  },
];

export default function HomeScreen() {
  const [plans, setPlans] = useState<Plan[]>(INITIAL_PLANS);

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(
    null
  );

  const [creatingNewPlan, setCreatingNewPlan] = useState(false);

  const [request, setRequest] = useState("");

  const [loading, setLoading] = useState(false);

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) ?? null,
    [plans, selectedPlanId]
  );

  function handleNewPlan() {
    setSelectedPlanId(null);
    setCreatingNewPlan(true);
    setRequest("");
  }

  function handleSelectPlan(plan: Plan) {
    setCreatingNewPlan(false);
    setSelectedPlanId(plan.id);
    setRequest("");
  }

  function handleBackToPlans() {
    setSelectedPlanId(null);
    setCreatingNewPlan(false);
    setRequest("");
  }

  async function handleCreatePlan() {
    const trimmedRequest = request.trim();

    if (!trimmedRequest || loading) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://10.0.2.2:3000/api/plans/generate",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            prompt: trimmedRequest,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate plan");
      }

      const newPlan = await response.json();

      setPlans((currentPlans) => [
        newPlan,
        ...currentPlans,
      ]);

      setRequest("");
      setCreatingNewPlan(false);
      setSelectedPlanId(newPlan.id);
    } catch (error) {
      console.log("Failed to create plan:", error);
    } finally {
      setLoading(false);
    }
  }

  /*
    PLAN VIEW
  */
  if (selectedPlan) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={["top", "left", "right"]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.planContent}
        >
          <Pressable
            onPress={handleBackToPlans}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name="arrow-back"
              size={21}
              color="#C9D6E5"
            />

            <Text style={styles.backButtonText}>
              Plans
            </Text>
          </Pressable>

          <View style={styles.planHeader}>
            <Text style={styles.planTitle}>
              {selectedPlan.title}
            </Text>

            {selectedPlan.description && (
              <Text style={styles.planDescription}>
                {selectedPlan.description}
              </Text>
            )}
          </View>

          <DynamicPlanRenderer
            nodes={selectedPlan.content}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  /*
    CREATE PLAN VIEW
  */
  if (creatingNewPlan) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={["top", "left", "right"]}
      >
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={
            Platform.OS === "ios"
              ? "padding"
              : undefined
          }
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.createContent}
          >
            <Pressable
              onPress={handleBackToPlans}
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name="arrow-back"
                size={21}
                color="#C9D6E5"
              />

              <Text style={styles.backButtonText}>
                Plans
              </Text>
            </Pressable>

            <View style={styles.createHeader}>
              <Text style={styles.createTitle}>
                Create a new plan
              </Text>

              <Text style={styles.createSubtitle}>
                Tell me what you want to accomplish.
                Your plan will be organized around your
                request.
              </Text>
            </View>

            <View style={styles.promptCard}>
              <TextInput
                value={request}
                onChangeText={setRequest}
                placeholder="For example: Create a 4-week study plan for my exam..."
                placeholderTextColor="#596A80"
                multiline
                textAlignVertical="top"
                style={styles.promptInput}
              />

              <View style={styles.promptFooter}>
                <Text style={styles.promptHint}>
                  Describe your goal naturally
                </Text>

                <Pressable
                  disabled={
                    !request.trim() || loading
                  }
                  onPress={handleCreatePlan}
                  style={({ pressed }) => [
                    styles.sendButton,

                    (!request.trim() || loading) &&
                      styles.sendButtonDisabled,

                    pressed &&
                      request.trim() &&
                      !loading &&
                      styles.pressed,
                  ]}
                >
                  {loading ? (
                    <ActivityIndicator
                      size="small"
                      color="#FFFFFF"
                    />
                  ) : (
                    <Ionicons
                      name="arrow-up"
                      size={21}
                      color="#FFFFFF"
                    />
                  )}
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  /*
    PLANS HOME
  */
  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "left", "right"]}
    >
      <View style={styles.homeContent}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>
            What are we working on?
          </Text>

          <Text style={styles.welcomeSubtitle}>
            Continue one of your plans or create
            something new.
          </Text>
        </View>

        <Pressable
          onPress={handleNewPlan}
          style={({ pressed }) => [
            styles.newPlanCard,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.newPlanIcon}>
            <Ionicons
              name="add"
              size={27}
              color="#FFFFFF"
            />
          </View>

          <View style={styles.newPlanTextContainer}>
            <Text style={styles.newPlanTitle}>
              New plan
            </Text>

            <Text style={styles.newPlanSubtitle}>
              Start from a new request
            </Text>
          </View>

          <Ionicons
            name="arrow-forward"
            size={21}
            color="#78B8FF"
          />
        </Pressable>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Your plans
          </Text>

          <Text style={styles.planCount}>
            {plans.length}
          </Text>
        </View>

        {plans.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="layers-outline"
                size={27}
                color="#6CAEFF"
              />
            </View>

            <Text style={styles.emptyTitle}>
              No plans yet
            </Text>

            <Text style={styles.emptyDescription}>
              Create your first plan and it will
              appear here.
            </Text>
          </View>
        ) : (
          <FlatList
            data={plans}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.planList}
            renderItem={({ item }) => (
              <PlanCard
                plan={item}
                onPress={() =>
                  handleSelectPlan(item)
                }
              />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

/*
  INDIVIDUAL PLAN CARD
*/

function PlanCard({
  plan,
  onPress,
}: {
  plan: Plan;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.planCard,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.planCardIcon}>
        <Ionicons
          name="document-text-outline"
          size={22}
          color="#78B8FF"
        />
      </View>

      <View style={styles.planCardContent}>
        <Text
          numberOfLines={1}
          style={styles.planCardTitle}
        >
          {plan.title}
        </Text>

        {plan.description && (
          <Text
            numberOfLines={1}
            style={styles.planCardDescription}
          >
            {plan.description}
          </Text>
        )}

        <Text style={styles.planCardDate}>
          {plan.createdAt}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={19}
        color="#52657D"
      />
    </Pressable>
  );
}

/*
  DYNAMIC PLAN RENDERER

  This is deliberately separated from the AI request.

  Your future backend returns the structure.
  The mobile app only decides how each safe component
  type should look.
*/

function DynamicPlanRenderer({
  nodes,
}: {
  nodes?: DynamicNode[];
}) {
  if (!nodes || nodes.length === 0) {
    return (
      <View style={styles.placeholderPlan}>
        <Ionicons
          name="construct-outline"
          size={28}
          color="#72B3FF"
        />

        <Text style={styles.placeholderTitle}>
          Plan content
        </Text>

        <Text style={styles.placeholderText}>
          Dynamic plan components returned by your
          server will be rendered here.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.dynamicContainer}>
      {nodes.map((node) => {
        switch (node.type) {
          case "heading":
            return (
              <Text
                key={node.id}
                style={styles.dynamicHeading}
              >
                {node.props?.text}
              </Text>
            );

          case "text":
            return (
              <Text
                key={node.id}
                style={styles.dynamicText}
              >
                {node.props?.text}
              </Text>
            );

          case "card":
            return (
              <View
                key={node.id}
                style={styles.dynamicCard}
              >
                {node.props?.title && (
                  <Text
                    style={
                      styles.dynamicCardTitle
                    }
                  >
                    {node.props.title}
                  </Text>
                )}

                {node.props?.text && (
                  <Text
                    style={
                      styles.dynamicCardText
                    }
                  >
                    {node.props.text}
                  </Text>
                )}
              </View>
            );

          case "checklist":
            return (
              <View
                key={node.id}
                style={styles.dynamicCard}
              >
                {(
                  node.props?.items ?? []
                ).map(
                  (
                    item: string,
                    index: number
                  ) => (
                    <View
                      key={`${node.id}-${index}`}
                      style={
                        styles.checklistRow
                      }
                    >
                      <View
                        style={
                          styles.checklistCircle
                        }
                      />

                      <Text
                        style={
                          styles.checklistText
                        }
                      >
                        {item}
                      </Text>
                    </View>
                  )
                )}
              </View>
            );

          default:
            return null;
        }
      })}
    </View>
  );
}

function generateTemporaryTitle(
  request: string
) {
  const words = request
    .trim()
    .split(/\s+/)
    .slice(0, 5);

  const title = words.join(" ");

  if (!title) {
    return "New plan";
  }

  return (
    title.charAt(0).toUpperCase() +
    title.slice(1)
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: "#07111F",
  },

  homeContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 95,
  },

  welcomeSection: {
    marginBottom: 28,
  },

  welcomeTitle: {
    color: "#F3F7FC",
    fontSize: 29,
    fontWeight: "700",
    letterSpacing: -0.7,
    marginBottom: 8,
  },

  welcomeSubtitle: {
    color: "#8090A6",
    fontSize: 15,
    lineHeight: 22,
  },

  newPlanCard: {
    minHeight: 86,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0D1D30",
    borderWidth: 1,
    borderColor: "#1B3C5F",
    borderRadius: 21,
    paddingHorizontal: 16,
    marginBottom: 30,
  },

  newPlanIcon: {
    width: 49,
    height: 49,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2878D7",
    borderRadius: 16,
    marginRight: 14,
  },

  newPlanTextContainer: {
    flex: 1,
  },

  newPlanTitle: {
    color: "#EFF6FE",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },

  newPlanSubtitle: {
    color: "#72849B",
    fontSize: 13,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 13,
  },

  sectionTitle: {
    color: "#CCD7E5",
    fontSize: 15,
    fontWeight: "600",
  },

  planCount: {
    minWidth: 24,
    height: 24,
    textAlign: "center",
    textAlignVertical: "center",
    color: "#75B5FF",
    backgroundColor: "#10243A",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 9,
  },

  planList: {
    paddingBottom: 30,
  },

  planCard: {
    minHeight: 92,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0C1929",
    borderWidth: 1,
    borderColor: "#17283C",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 11,
  },

  planCardIcon: {
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#10243A",
    borderRadius: 14,
    marginRight: 14,
  },

  planCardContent: {
    flex: 1,
  },

  planCardTitle: {
    color: "#E7EEF7",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },

  planCardDescription: {
    color: "#71839A",
    fontSize: 12,
    marginBottom: 6,
  },

  planCardDate: {
    color: "#506178",
    fontSize: 11,
  },

  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 30,
  },

  emptyIcon: {
    width: 58,
    height: 58,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 19,
    backgroundColor: "#10243A",
    marginBottom: 16,
  },

  emptyTitle: {
    color: "#E5EDF7",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 7,
  },

  emptyDescription: {
    color: "#6F8198",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
  },

  createContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 120,
  },

  backButton: {
    alignSelf: "flex-start",
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0C1929",
    borderWidth: 1,
    borderColor: "#17283C",
    borderRadius: 13,
    paddingHorizontal: 13,
    gap: 7,
    marginBottom: 34,
  },

  backButtonText: {
    color: "#B7C5D6",
    fontSize: 14,
    fontWeight: "500",
  },

  createHeader: {
    marginBottom: 30,
  },

  createIcon: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "#10243A",
    borderWidth: 1,
    borderColor: "#193B5F",
    marginBottom: 22,
  },

  createTitle: {
    color: "#F3F7FC",
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: -0.7,
    marginBottom: 10,
  },

  createSubtitle: {
    color: "#7C8DA4",
    fontSize: 15,
    lineHeight: 23,
    maxWidth: 370,
  },

  promptCard: {
    backgroundColor: "#0C1929",
    borderWidth: 1,
    borderColor: "#1A2D43",
    borderRadius: 22,
    padding: 15,
  },

  promptInput: {
    minHeight: 170,
    color: "#E7EEF7",
    fontSize: 16,
    lineHeight: 24,
  },

  promptFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },

  promptHint: {
    color: "#52667D",
    fontSize: 12,
  },

  sendButton: {
    width: 46,
    height: 46,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: "#2878D7",
  },

  sendButtonDisabled: {
    backgroundColor: "#193552",
    opacity: 0.6,
  },

  planContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 120,
  },

  planHeader: {
    marginBottom: 28,
  },

  planTitle: {
    color: "#F3F7FC",
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: -0.7,
    marginBottom: 9,
  },

  planDescription: {
    color: "#77899F",
    fontSize: 14,
    lineHeight: 21,
  },

  dynamicContainer: {
    gap: 14,
  },

  dynamicHeading: {
    color: "#EDF4FC",
    fontSize: 21,
    fontWeight: "700",
    marginTop: 4,
  },

  dynamicText: {
    color: "#A5B3C4",
    fontSize: 15,
    lineHeight: 23,
  },

  dynamicCard: {
    backgroundColor: "#0C1929",
    borderWidth: 1,
    borderColor: "#17283C",
    borderRadius: 19,
    padding: 17,
  },

  dynamicCardTitle: {
    color: "#E7EEF7",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 7,
  },

  dynamicCardText: {
    color: "#8C9CB0",
    fontSize: 14,
    lineHeight: 21,
  },

  checklistRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 7,
  },

  checklistCircle: {
    width: 18,
    height: 18,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#5CA5F7",
    marginTop: 1,
    marginRight: 11,
  },

  checklistText: {
    flex: 1,
    color: "#AAB7C7",
    fontSize: 14,
    lineHeight: 21,
  },

  placeholderPlan: {
    alignItems: "center",
    backgroundColor: "#0C1929",
    borderWidth: 1,
    borderColor: "#17283C",
    borderRadius: 21,
    paddingVertical: 45,
    paddingHorizontal: 25,
  },

  placeholderTitle: {
    color: "#E7EEF7",
    fontSize: 17,
    fontWeight: "600",
    marginTop: 14,
    marginBottom: 8,
  },

  placeholderText: {
    color: "#71839A",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
  },

  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },
});