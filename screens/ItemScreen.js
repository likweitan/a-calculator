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

const renderItem = ({ item }) => (
  <View style={styles.row}>
    <Text style={styles.cell}>{item.month}</Text>
    <Text style={styles.cell}>MYR {item.interest}</Text>
    <Text style={styles.cell}>MYR {item.principal}</Text>
    <Text style={styles.cell}>MYR {item.balance}</Text>
  </View>
);

const ItemScreen = ({ navigation, route }) => {
  const { schedule } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "col", alignItems: "baseline" }}>
            <Text style={styles.title}>Amortization Schedule</Text>
          </View>
        </View>
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Month</Text>
          <Text style={styles.headerCell}>Interest</Text>
          <Text style={styles.headerCell}>Principal</Text>
          <Text style={styles.headerCell}>Balance</Text>
        </View>
        <FlatList
          data={schedule}
          renderItem={renderItem}
          keyExtractor={(item) => item.month.toString()}
          showsVerticalScrollIndicator={true} // Hides the vertical scrollbar
          keyboardShouldPersistTaps="handled"
        />
      </View>
    </SafeAreaView>
  );
};

export default ItemScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 5,
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 12,
      fontWeight: "regular",
      color: "#776B5D",
    },
    headerRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#B0A695",
      paddingBottom: 5,
      marginBottom: 5,
    },
    headerCell: {
      flex: 1,
      fontWeight: "bold",
      textAlign: "left",
    },
    row: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#EBE3D5",
      paddingVertical: 5,
    },
    cell: {
      flex: 1,
      textAlign: "left",
    },
  });
