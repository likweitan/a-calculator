// import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AppsScreen from "./screens/AppsScreen";
import HomeScreen from "./screens/HomeScreen";
import ItemScreen from "./screens/ItemScreen";
import CompoundInterestCalculatorScreen from "./screens/CompoundInterestCalculatorScreen";
import SettingsScreen from "./screens/SettingsScreen";
import LoanCalculatorScreen from "./screens/LoanCalculatorScreen";
import FuelCalculatorScreen from "./screens/FuelCalculatorScreen";
import LoanComparisonScreen from "./screens/LoanComparisonScreen";
import PropertyTaxCalculatorScreen from "./screens/PropertyTaxCalculatorScreen";
import ROICalculatorScreen from "./screens/ROICalculatorScreen";
import Icon from "react-native-vector-icons/Ionicons"; // Import icon set
import { createStackNavigator } from "@react-navigation/stack";

// Create Stack Navigator for detailed views
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const CustomHeader = () => (
  <View style={{ backgroundColor: "tomato", padding: 20 }}>
    <Text style={{ color: "white", fontSize: 18 }}>Custom Header</Text>
  </View>
);

function Home() {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === "Feed") {
              iconName = "home-outline"; // Icon for Home screen
            } else if (route.name === "Settings") {
              iconName = "settings-outline"; // Icon for Settings screen
            } else if (route.name === "Apps") {
              iconName = "compass-outline"; // Icon for Settings screen
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          headerShown: false, // Disable header
          headerTitle: "MonkeyCalc",
          tabBarActiveTintColor: "#776B5D",
          tabBarInactiveTintColor: "#B0A695",
          headerStyle: { backgroundColor: "#776B5D" },
          // headerTintColor: '#fff',
          // headerTitleStyle: { fontWeight: 'bold' },
        })}
      >
        {/* <Tab.Screen name="Feed" component={HomeScreen} /> */}
        {/* <Tab.Screen name="Feed" component={HomeScreen} options={{
            headerTitle: 'Evenly',
            headerStyle: { backgroundColor: '#776B5D' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
            // You can also use a custom component for the header:
            // header: () => <CustomHeader />,
          }} /> */}
        <Tab.Screen name="Apps" component={AppsScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </View>
  );
}

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: true,
            headerStyle: { height: 70 },
            headerTitleStyle: { fontSize: 18 },
            headerStyle: { backgroundColor: "#F6F6F6" },
            // headerTintColor: '#8785A2',
          }}
        >
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LoanCalculator"
            component={LoanCalculatorScreen}
            options={{ headerShown: true, headerTitle: "Loan Calculator" }}
          />
          <Stack.Screen
            name="LoanCalculatorItem"
            component={ItemScreen}
            options={{ headerShown: true, headerTitle: "Loan Calculator" }}
          />
          <Stack.Screen
            name="CompoundInterestCalculatorScreen"
            component={CompoundInterestCalculatorScreen}
            options={{
              headerShown: true,
              headerTitle: "Compound Interest Calculator",
            }}
          />
          <Stack.Screen
            name="FuelCalculator"
            component={FuelCalculatorScreen}
            options={{ headerShown: true, headerTitle: "Fuel Calculator" }}
          />
          <Stack.Screen
            name="PropertyTaxCalculator"
            component={PropertyTaxCalculatorScreen}
            options={{
              headerShown: true,
              headerTitle: "Property Tax Calculator",
            }}
          />
          <Stack.Screen
            name="ROICalculator"
            component={ROICalculatorScreen}
            options={{ headerShown: true, headerTitle: "ROI Calculator" }}
          />
          <Stack.Screen
            name="LoanComparison"
            component={LoanComparisonScreen}
            options={{ headerShown: true, headerTitle: "Loan Comparison" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar barStyle="default" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Set the default background color to white
  },
});
