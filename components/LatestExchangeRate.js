import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LatestExchangeRate = () => {
  const [latestRate, setLatestRate] = useState(null);

  const jsonData = [
    {
      "exchange_rate": "3.2895",
      "timestamp": "2024-09-01T01:12:19.332438",
      "platform": "CIMB"
    },
    {
      "exchange_rate": "3.2895",
      "timestamp": "2024-09-01T02:18:29.036276",
      "platform": "CIMB"
    }
  ];

  useEffect(() => {
    // Filter data for CIMB platform
    const cimbRates = jsonData.filter(item => item.platform === "CIMB");

    // Sort by timestamp to get the latest entry
    const sortedRates = cimbRates.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Get the latest rate
    if (sortedRates.length > 0) {
      setLatestRate(sortedRates[0].exchange_rate);
    }
  }, []);

  return (
    <View>
      {latestRate ? (
        <View style={styles.card}>
        <Text style={styles.title}>Latest CIMB Exchange Rate</Text>
        <View  style={styles.item}>
        <Text style={styles.itemText}> 1 SGD = {latestRate} MYR</Text>
        </View>
        </View>
      ) : (
        <Text>No CIMB Exchange Rate Found</Text>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 300,
    padding: 20,
    flexDirection: 'row'
  },
  card: {
    paddingBottom: 5,
    borderRadius: 6
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18
  },
  item: {
    flexDirection: "row", // Layout items horizontally
    justifyContent: "center", // Space between left and right text
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderRadius: 5,
  },
  itemText: {
    fontSize: 20,
    fontWeight: "bold",
  }
});

export default LatestExchangeRate;

