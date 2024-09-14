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
} from "react-native";

// Sample data for the list group
const data = [
  {
    id: '1',
    title: 'Basic',
    data: [{ id: '1', leftText: 'Country', rightText: 'Malaysia' }, { id: '2', leftText: 'Language', rightText: 'English' }],
  },
  {
    id: "2",
    title: "About",
    data: [{ id: "2", leftText: "Version", rightText: "1.0.0" }],
  },
];

// Component to render each item in the group
const Item = ({ leftText, rightText }) => (
  <View style={styles.item}>
    <Text style={styles.leftText}>{leftText}</Text>
    <Text style={styles.rightText}>{rightText}</Text>
  </View>
);

// Component to render each group and its items
const Group = ({ title, data }) => (
  <View style={styles.group}>
    <Text style={styles.groupTitle}>{title}</Text>
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <Item leftText={item.leftText} rightText={item.rightText} />
      )}
      keyExtractor={(item) => item.id}
    />
  </View>
);

const SettingsScreen = () => {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isDarkThemeEnabled, setIsDarkThemeEnabled] = useState(false);

  const toggleNotifications = () =>
    setIsNotificationsEnabled((previousState) => !previousState);
  const toggleTheme = () =>
    setIsDarkThemeEnabled((previousState) => !previousState);

  return (
    <SafeAreaView style={styles.container}>
      {/* <Text style={styles.settingsTitle}>Settings</Text> */}
      <FlatList
        data={data}
        renderItem={({ item }) => <Group title={item.title} data={item.data} />}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

export default SettingsScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    marginHorizontal: 20,
  },
  settingsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 0,
  },
  group: {
    marginBottom: 10,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    flexDirection: "row", // Layout items horizontally
    justifyContent: "space-between", // Space between left and right text
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderRadius: 5,
  },
  leftText: {
    fontSize: 14,
  },
  rightText: {
    fontSize: 14,
    color: "gray",
  },
});
