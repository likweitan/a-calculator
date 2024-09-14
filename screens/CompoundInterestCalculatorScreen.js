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
import LoanPaymentPieChart from "../components/LoanPaymentPieChart";
import Slider from "@react-native-community/slider";

const CompoundInterestCalculatorScreen = ({ navigation }) => {
  const [results, setResults] = useState(null);

  const compoundingOptions = [
    { value: 0, label: "No compound" },
    { value: 1, label: "Annually" },
    { value: 2, label: "Semi-annually" },
    { value: 4, label: "Quarterly" },
    { value: 12, label: "Monthly" },
    { value: 52, label: "Weekly" },
    { value: 365, label: "Daily" },
  ];

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      principalAmount: "",
      monthlyDeposit: "",
      interestRate: "",
      period: "",
      compoundingFrequency: 0, // Default to "No compound"
    },
  });

  const principalAmount = watch("principalAmount");
  const monthlyDeposit = watch("monthlyDeposit");
  const interestRate = watch("interestRate");
  const period = watch("period");
  const compoundingFrequency = watch("compoundingFrequency");

  // Load saved data from AsyncStorage on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedPrincipalAmount = await AsyncStorage.getItem("principalAmount");
        const savedMonthlyDeposit = await AsyncStorage.getItem("monthlyDeposit");
        const savedInterestRate = await AsyncStorage.getItem("compoundingInterestRate");
        const savedPeriod = await AsyncStorage.getItem("period");
        const savedCompoundingFrequency = await AsyncStorage.getItem("compoundingFrequency");

        if (
          savedPrincipalAmount &&
          savedMonthlyDeposit &&
          savedInterestRate &&
          savedPeriod &&
          savedCompoundingFrequency
        ) {
          reset({
            principalAmount: savedPrincipalAmount,
            monthlyDeposit: savedMonthlyDeposit,
            interestRate: savedInterestRate,
            period: savedPeriod,
            compoundingFrequency: parseInt(savedCompoundingFrequency, 10),
          });
        }
      } catch (error) {
        console.error("Failed to load data from AsyncStorage", error);
      }
    };

    loadData();
  }, [reset]);

  useEffect(() => {
    if (
      principalAmount &&
      monthlyDeposit &&
      interestRate &&
      period &&
      compoundingFrequency !== undefined
    ) {
      const newResults = calculateCompoundInterest(
        principalAmount.replace(/,/g, ""),
        monthlyDeposit.replace(/,/g, ""),
        interestRate,
        period,
        compoundingFrequency
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
  }, [
    principalAmount,
    monthlyDeposit,
    interestRate,
    period,
    compoundingFrequency,
    calculateCompoundInterest,
    results,
  ]);

  const calculateCompoundInterest = useCallback(
    (principal, monthly, rate, time, compoundFrequency) => {
      const P = parseFloat(principal);
      const M = parseFloat(monthly);
      const r = parseFloat(rate) / 100;
      const t = parseFloat(time) / 12; // Convert months to years
      const n = compoundFrequency;
  
      if (
        isNaN(P) ||
        isNaN(M) ||
        isNaN(r) ||
        isNaN(t) ||
        P < 0 ||
        M < 0 ||
        r < 0 ||
        t <= 0
      ) {
        return null;
      }
  
      let A, totalDeposits, interestAmount, apy;
  
      if (n === 0) {
        // Simple interest for no compound
        A = P * (1 + r * t) + M * time * (1 + (r * t) / 2);
        totalDeposits = P + M * time;
        interestAmount = A - totalDeposits;
        apy = r * 100;
      } else {
        const ratePerPeriod = r / n;
        const numPeriods = n * t;
        
        // Calculate compound interest on principal
        const principalGrowth = P * Math.pow(1 + ratePerPeriod, numPeriods);
        
        // Calculate future value of a series for monthly deposits
        const depositGrowth = M * ((Math.pow(1 + ratePerPeriod, numPeriods) - 1) / ratePerPeriod) * (1 + ratePerPeriod);
  
        A = principalGrowth + depositGrowth;
        totalDeposits = P + M * time;
        interestAmount = A - totalDeposits;
        apy = (Math.pow(1 + r / n, n) - 1) * 100;
      }
  
      return {
        totalPrincipal: formatter.format(totalDeposits.toFixed(2)),
        interestAmount: formatter.format(interestAmount.toFixed(2)),
        maturityValue: formatter.format(A.toFixed(2)),
        apy: apy.toFixed(4),
        principalValue: P,
        totalPrincipalValue: totalDeposits,
        interestValue: interestAmount,
      };
    },
    []
  );
  
  

  const onSubmit = async (data) => {
    try {
      await AsyncStorage.setItem("principalAmount", data.principalAmount);
      await AsyncStorage.setItem("monthlyDeposit", data.monthlyDeposit);
      await AsyncStorage.setItem("compoundingInterestRate", data.interestRate);
      await AsyncStorage.setItem("period", data.period);
      await AsyncStorage.setItem("compoundingFrequency", data.compoundingFrequency.toString());
    } catch (error) {
      console.error("Failed to save data to AsyncStorage", error);
    }
  };

  const formatNumberWithCommas = (value) => {
    const number = value.replace(/[^0-9]/g, "");
    return new Intl.NumberFormat("en-US").format(number);
  };

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const getCompoundingLabel = (value) => {
    const option = compoundingOptions.find(opt => opt.value === value);
    return option ? option.label : "Unknown";
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ flex: 1, marginRight: 5 }}>
              <Controller
                control={control}
                name="principalAmount"
                rules={{ required: "Principal amount is required" }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Principal Amount</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={(text) => {
                        onChange(formatNumberWithCommas(text));
                        onSubmit({ ...watch(), principalAmount: text });
                      }}
                      onBlur={onBlur}
                      value={value}
                      keyboardType="numeric"
                      placeholder="Enter principal amount"
                    />
                    {errors.principalAmount && (
                      <Text style={styles.error}>
                        {errors.principalAmount.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>
            <View style={{ flex: 1, marginRight: 5 }}>
              <Controller
                control={control}
                name="monthlyDeposit"
                rules={{ required: "Monthly deposit is required" }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Monthly Deposit</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={(text) => {
                        onChange(formatNumberWithCommas(text));
                        onSubmit({ ...watch(), monthlyDeposit: text });
                      }}
                      onBlur={onBlur}
                      value={value}
                      keyboardType="numeric"
                      placeholder="Enter monthly deposit"
                    />
                    {errors.monthlyDeposit && (
                      <Text style={styles.error}>
                        {errors.monthlyDeposit.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ flex: 1, marginRight: 5 }}>
              <Controller
                control={control}
                name="interestRate"
                rules={{ required: "Interest rate is required" }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Annual Interest Rate (%)</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={(text) => {
                        onChange(text);
                        onSubmit({ ...watch(), interestRate: text });
                      }}
                      onBlur={onBlur}
                      value={value}
                      keyboardType="numeric"
                      placeholder="Enter interest rate"
                    />
                    {errors.interestRate && (
                      <Text style={styles.error}>
                        {errors.interestRate.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>
            <View style={{ flex: 1, marginRight: 5 }}>
              <Controller
                control={control}
                name="period"
                rules={{ required: "Period is required" }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Period (Months)</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={(text) => {
                        onChange(text);
                        onSubmit({ ...watch(), period: text });
                      }}
                      onBlur={onBlur}
                      value={value}
                      keyboardType="numeric"
                      placeholder="Enter period in months"
                    />
                    {errors.period && (
                      <Text style={styles.error}>{errors.period.message}</Text>
                    )}
                  </View>
                )}
              />
            </View>
          </View>
          <View>
            <Controller
              control={control}
              name="compoundingFrequency"
              render={({ field: { onChange, value } }) => (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Compounding Frequency: {getCompoundingLabel(value)}</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={6}
                    step={1}
                    value={compoundingOptions.findIndex(opt => opt.value === value)}
                    onValueChange={(index) => {
                      const newValue = compoundingOptions[index].value;
                      onChange(newValue);
                      onSubmit({ ...watch(), compoundingFrequency: newValue });
                    }}
                    minimumTrackTintColor="#B0A695"
                    maximumTrackTintColor="#000000"
                  />
                </View>
              )}
            />
          </View>
          {results && (
            <>
              <View style={styles.resultsContainer}>
                <LoanPaymentPieChart
                  title="Interest Breakdown"
                  principal={results.totalPrincipalValue}
                  totalInterest={results.interestValue}
                />
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
                  <Text style={styles.label}>Maturity Value</Text>
                  <Text>{results.maturityValue}</Text>
                </View>
                <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
                  <Text style={styles.label}>APY</Text>
                  <Text>{results.apy}%</Text>
                </View>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
  slider: {
    width: "100%",
    height: 40,
  },
  error: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
  },
  resultsContainer: {
    borderTopWidth: 1,
    borderColor: "#B0A695",
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#B0A695",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default CompoundInterestCalculatorScreen;