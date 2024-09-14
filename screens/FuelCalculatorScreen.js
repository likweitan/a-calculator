import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LineChart from "../components/LineChart";

// https://api.data.gov.my/data-catalogue/?id=fuelprice&filter=level@series_type
const fuelPrices = [
  {
    date: "2024-08-22",
    ron95: 2.05,
    ron97: 3.47,
    diesel: 3.23,
    series_type: "level",
    diesel_eastmsia: 2.15,
  },
  {
    date: "2024-08-29",
    ron95: 2.05,
    ron97: 3.42,
    diesel: 3.18,
    series_type: "level",
    diesel_eastmsia: 2.15,
  },
  {
    date: "2024-09-05",
    ron95: 2.05,
    ron97: 3.4,
    diesel: 3.16,
    series_type: "level",
    diesel_eastmsia: 2.15,
  },
];

const FuelEconomyCalculatorScreen = ({ navigation }) => {
  const [results, setResults] = useState(null);
  const [latestFuelPrices, setLatestFuelPrices] = useState(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      distance: "",
      fuelUsed: "",
      fuelEconomy: "",
    },
  });

  const distance = watch("distance");
  const fuelUsed = watch("fuelUsed");
  const fuelEconomy = watch("fuelEconomy");

  // Load saved data from AsyncStorage on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const distance = await AsyncStorage.getItem("distance");
        const fuelUsed = await AsyncStorage.getItem("fuelUsed");
        const fuelEconomy = await AsyncStorage.getItem("fuelEconomy");

        if (distance && fuelUsed && fuelEconomy) {
          reset({
            distance,
            fuelUsed,
            fuelEconomy,
          });
        }
      } catch (error) {
        console.error("Failed to load data from AsyncStorage", error);
      }
    };

    loadData();

    // Get the latest fuel prices
    const latest = fuelPrices[fuelPrices.length - 1];
    setLatestFuelPrices(latest);
  }, [reset]);

  useEffect(() => {
    if (distance && fuelUsed) {
      const newResults = calculateFuelEconomy(
        parseFloat(distance),
        parseFloat(fuelUsed)
      );
      if (
        newResults !== null &&
        JSON.stringify(newResults) !== JSON.stringify(results)
      ) {
        setResults(newResults);
      }
    } else {
      setResults(null);
    }
  }, [distance, fuelUsed, calculateFuelEconomy, results]);

  const calculateFuelEconomy = useCallback((distance, fuelUsed) => {
    if (isNaN(distance) || isNaN(fuelUsed) || distance <= 0 || fuelUsed <= 0) {
      return null;
    }

    const fuelEconomy = distance / fuelUsed;

    return {
      fuelEconomy: fuelEconomy.toFixed(2),
      distanceValue: distance,
      fuelUsedValue: fuelUsed,
    };
  }, []);

  const onSubmit = async (data) => {
    try {
      await AsyncStorage.setItem("distance", data.distance);
      await AsyncStorage.setItem("fuelUsed", data.fuelUsed);
      await AsyncStorage.setItem("fuelEconomy", data.fuelEconomy);
    } catch (error) {
      console.error("Failed to save data to AsyncStorage", error);
    }
  };

  const onReset = async () => {
    reset();
    setResults(null);
    try {
      await AsyncStorage.removeItem("distance");
      await AsyncStorage.removeItem("fuelUsed");
      await AsyncStorage.removeItem("fuelEconomy");
    } catch (error) {
      console.error("Failed to remove data from AsyncStorage", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          
          {latestFuelPrices && (
            <>
            <Text style={styles.label}>
            Latest Fuel Prices{/*  (as of {latestFuelPrices.date}) */}
          </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <View style={{ flexDirection: "column", alignItems: "center" }}>
              <View style={[styles.fuelPricesContainer, { backgroundColor: "#F4CE14" }]}>
                <Text style={styles.fuelPricesTitle}>
                  RON95
                </Text>
                <Text style={styles.fuelPriceText}>
                  RM {latestFuelPrices.ron95.toFixed(2)}
                </Text>
                </View>
              </View>
              <View style={{ flexDirection: "column", alignItems: "center" }}>
              <View style={[styles.fuelPricesContainer, { backgroundColor: "#379777" }]}>
                <Text style={styles.fuelPricesTitle}>
                  RON97
                </Text>
                <Text style={styles.fuelPriceText}>
                  RM {latestFuelPrices.ron97.toFixed(2)}
                </Text>
                </View>
              </View>
              <View style={{ flexDirection: "column", alignItems: "center" }}>
                
              <View style={[styles.fuelPricesContainer, { backgroundColor: "#45474B" }]}>
                <Text style={styles.fuelPricesTitle}>
                Diesel
                </Text>
                <Text style={styles.fuelPriceText}>
                  RM {latestFuelPrices.diesel.toFixed(2)}
                </Text>
                </View>
              </View>
              {/* <View style={{ flexDirection: "column", alignItems: "center" }}>
                
              <View style={[styles.fuelPricesContainer, { backgroundColor: "#45474B" }]}>
                <Text style={styles.fuelPricesTitle}>
                EM
                </Text>
                <Text style={styles.fuelPriceText}>
                  RM {latestFuelPrices.diesel_eastmsia.toFixed(2)}
                </Text>
              </View>
              </View> */}
            </View></>
          )}
<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
<View style={{ flex: 1, marginRight: 5 }}>
          <Controller
            control={control}
            name="distance"
            rules={{ required: "Distance is required" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Distance (kilometres)</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => {
                    onChange(text);
                    onSubmit({ ...watch(), distance: text });
                  }}
                  onBlur={onBlur}
                  value={value}
                  keyboardType="numeric"
                  placeholder="Enter distance"
                />
                {errors.distance && (
                  <Text style={styles.error}>{errors.distance.message}</Text>
                )}
              </View>
            )}
          />
</View>
<View style={{ flex: 1, marginRight: 5 }}>
          <Controller
            control={control}
            name="fuelUsed"
            rules={{ required: "Fuel used is required" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Fuel Used (litres)</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => {
                    onChange(text);
                    onSubmit({ ...watch(), fuelUsed: text });
                  }}
                  onBlur={onBlur}
                  value={value}
                  keyboardType="numeric"
                  placeholder="Enter fuel used"
                />
                {errors.fuelUsed && (
                  <Text style={styles.error}>{errors.fuelUsed.message}</Text>
                )}
              </View>
            )}
          />
</View></View>
          {results && (
            <>
              <View style={styles.resultsContainer}>
                <LineChart
                  title="Fuel Economy"
                  subtitle="Distance Travelled"
                  value={results.distanceValue}
                  totalInterest={40}
                  unit="KM"
                />
                <LineChart
                  title="Fuel Economy"
                  subtitle="Fuel Used"
                  value={results.fuelUsedValue}
                  totalInterest={50}
                  unit="L"
                />
              </View>
              <View style={styles.resultTextContainer}>
                <Text style={styles.resultText}>
                  {results.fuelEconomy} km/L
                </Text>
              </View>
            </>
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  fuelPricesContainer: {
    backgroundColor: "#B0A695",
    padding: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10, 
    // shadowOffset: { width: 0, height: 2 }, 
    // shadowOpacity: 0.25, 
    // shadowRadius: 3.84, 
    // elevation: 5 // for Android
  },
  fuelPricesTitle: {
    fontSize: 16,
    marginBottom: 0,
    color: "#F5F7F8",
    fontWeight: "bold",
  },
  fuelPriceText: {
    fontSize: 18,
    marginBottom: 2,
    color: "#F5F7F8",
    fontWeight: "bold",
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#EBE3D5",
    borderRadius: 5,
    padding: 5, //5
    fontSize: 14, //14
    backgroundColor: "#fff",
  },
  error: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
  },
  resultsContainer: {
    borderTopWidth: 1,
    borderColor: "#B0A695",
    marginTop: 20,
  },
  resultTextContainer: {
    marginTop: 10,
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default FuelEconomyCalculatorScreen;
