import React, { useState } from 'react';
import { View, Text, Switch, Button, StyleSheet, SafeAreaView, SectionList, StatusBar, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import LatestExchangeRate from '../components/LatestExchangeRate';

// Sample data for the list group
const data = [
    { id: '1', icon: '', text: 'First Launch', button: '>' },
    // { id: '2', icon: 'calculator-outline', text: 'Currency Exchange', button: '>' }
  ];
  
// Component to render each item with icon and text
// const ItemWithIcon = ({ icon, text, button }) => (
//     <View style={styles.item}>
//       <Icon name={icon} size={24} color="black" style={styles.icon} />
//       <Text style={styles.itemText}>{text}</Text>
//       {/* <Text style={styles.itemText}>{button}</Text> */}
//     </View>
//   );
const ItemWithIcon = ({ icon, text, button, onPress }) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <Icon name={icon} size={24} color="black" style={styles.icon} />
      <Text style={styles.itemText}>{text}</Text>
      {/* <Text style={styles.itemButton}>{button}</Text> */}
    </TouchableOpacity>
  );
  
  // Component to render each group and its items
  const Group = ({ title, data }) => (
    <View style={styles.container}>
    <Text style={styles.groupTitle}>{title}</Text>
    <FlatList
        data={data}
        renderItem={({ item }) => (
          <ItemWithIcon
            icon={item.icon}
            text={item.text}
            button={item.button}
            onPress={() => navigation.navigate('Settings')}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );

const HomeScreen = ({ navigation }) => {
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isDarkThemeEnabled, setIsDarkThemeEnabled] = useState(false);

  const toggleNotifications = () => setIsNotificationsEnabled(previousState => !previousState);
  const toggleTheme = () => setIsDarkThemeEnabled(previousState => !previousState);

  return (
    <SafeAreaView style={styles.container}>
        {/* <Text style={styles.homeTitle}>MonkeyCalc</Text> */}
        <LatestExchangeRate />
        {/* <FlatList
        data={data}
        renderItem={({ item }) => (
          <ItemWithIcon
            icon={item.icon}
            text={item.text}
            button={item.button}
            onPress={() => navigation.navigate('LoanCalculator')}
          />
        )}
        keyExtractor={(item) => item.id}
      /> */}
  </SafeAreaView>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 40,
      marginHorizontal: 20,
    },
    homeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
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
    icon: {
      marginRight: 10, // Space between icon and text
    },
    itemText: {
      fontSize: 18,
    },
  });