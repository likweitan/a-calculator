import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  Button,
  StyleSheet,
  SafeAreaView,
  SectionList,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Import Ionicons

const FabButton = ({ icon, text, onPress }) => {
  return (
    <View style={styles.appContainer}>
      <TouchableOpacity style={styles.fab} onPress={onPress}>
        <Icon name={icon} size={28} color="#776B5D" />
      </TouchableOpacity>
      <Text style={styles.fabText}>{text}</Text>
    </View>
  );
};

const data = [
  // {
  //   id: "1",
  //   title: "Finance",
  //   data: [
  //     {
  //       id: "1",
  //       icon: "keypad-outline",
  //       text: "Compound Interest Calculator",
  //       button: ">",
  //       screen: "CompoundInterestCalculatorScreen",
  //     },
  //   ],
  // },
  {
    id: "2",
    title: "Housing",
    data: [
      {
        id: "1",
        icon: "home-outline",
        text: "Mortgage Calculator",
        button: ">",
        screen: "LoanCalculator",
      },
      {
        id: "2",
        icon: "swap-horizontal-outline",
        text: "Loan Comparison",
        button: ">",
        screen: "LoanComparison",
      },
      {
        id: "3",
        icon: "business-outline",
        text: "ROI Calculator",
        button: ">",
        screen: "ROICalculator",
      },
      {
        id: "4",
        icon: "pricetag-outline",
        text: "Property Tax Calculator",
        button: ">",
        screen: "PropertyTaxCalculator",
      },
    ],
  },
  {
    id: "3",
    title: "Automotive",
    data: [
      {
        id: "1",
        icon: "car-outline",
        text: "Fuel Efficiency Calculator",
        button: ">",
        screen: "FuelCalculator",
      },
    ],
  },
];

const Item = ({ icon, text, button, onPress }) => (
  <View style={styles.appContainer}>
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <FabButton icon={icon} text={text} onPress={onPress} />
    </TouchableOpacity>
  </View>
);

// Component to render each group and its items
const Group = ({ title, data, navigation }) => (
  <View style={styles.group}>
    <Text style={styles.groupTitle}>{title}</Text>
    <View style={styles.itemRow}>
      {data.map((item) => (
        <View key={item.id}>
          <Item
            icon={item.icon}
            text={item.text}
            button={item.button}
            onPress={() => navigation.navigate(item.screen)}
          />
        </View>
      ))}
    </View>
  </View>
);

const AppsScreen = ({ navigation }) => {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isDarkThemeEnabled, setIsDarkThemeEnabled] = useState(false);

  const toggleNotifications = () =>
    setIsNotificationsEnabled((previousState) => !previousState);
  const toggleTheme = () =>
    setIsDarkThemeEnabled((previousState) => !previousState);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.appsTitle}>EXACTIFY</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <Group title={item.title} data={item.data} navigation={navigation} />
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

export default AppsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    marginHorizontal: 20,
  },
  appContainer: {
    flex: 1,
    height: 75,
    width: 75,
    // backgroundColor: "#fff",
    flexDirection: "column", // Layout items horizontally
    alignItems: "center", // Center items vertically
    alignContent: "center",
  },
  appsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  homeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  group: {
    marginTop: 10,
    marginBottom: 20,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderColor: "#B0A695",
  },
  item: {
    //flexDirection: "row", // Layout items horizontally
    //alignItems: "center", // Center items vertically
    //   justifyContent: 'space-between', // Space between left and right text
    padding: 0,
    // backgroundColor: "#fff",
    // borderBottomWidth: 1,
    borderBottomColor: "#EBE3D5",
    borderRadius: 5,
  },
  icon: {
    marginRight: 10, // Space between icon and text
  },
  itemText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  fab: {
    // position: 'absolute',
    // bottom: 60, // Adjust for space between FAB and text
    // right: 30,  // Distance from the right of the screen
    backgroundColor: "#fff",
    borderRadius: 20,
    // borderWidth: 1,
    borderColor: "#776B5D",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4, // Shadow for Android
    shadowColor: "#8785A2",
    shadowOffset: { width: 0, height: 2 }, // Shadow for iOS
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  fabText: {
    // position: 'absolute',
    // bottom: 30, // Place it just below the FAB
    // right: 40,  // Align text with the FAB
    color: "black", // Customize text color
    fontSize: 12, // Adjust font size as needed
    marginTop: 5,
    textAlign: "center",
  },
  itemsContainer: {
    flexDirection: "column", // Arrange items in a vertical column
  },
  itemRow: {
    flexDirection: "row", // Arrange the contents of each item in a row
    justifyContent: "space-between", // Space between icon, text, button
    alignItems: "center",
    paddingVertical: 10, // Add padding between rows
  },
});
