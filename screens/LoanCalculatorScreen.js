import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import {
  TouchableNativeFeedback,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { useForm, Controller } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoanPaymentPieChart from "../components/LoanPaymentPieChart";
import AmortizationSchedule from "../components/AmortizationSchedule"; // Adjust the import path as needed

const LoanCalculatorScreen = ({ navigation }) => {
  const [results, setResults] = useState(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      loanAmount: "",
      interestRate: "",
      loanTerm: "",
    },
  });

  const loanAmount = watch("loanAmount");
  const interestRate = watch("interestRate");
  const loanTerm = watch("loanTerm");

  // Load saved data from AsyncStorage on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const loanAmount = await AsyncStorage.getItem("loanAmount");
        const interestRate = await AsyncStorage.getItem("interestRate");
        const loanTerm = await AsyncStorage.getItem("loanTerm");

        if (loanAmount && interestRate && loanTerm) {
          reset({
            loanAmount,
            interestRate,
            loanTerm,
          });
        }
      } catch (error) {
        console.error("Failed to load data from AsyncStorage", error);
      }
    };

    loadData();
  }, [reset]);

  useEffect(() => {
    if (loanAmount && interestRate && loanTerm) {
      const newResults = calculateLoan(
        loanAmount.replace(/,/g, ""),
        interestRate,
        loanTerm
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
  }, [loanAmount, interestRate, loanTerm, calculateLoan, results]);

  const calculateLoan = useCallback((amount, rate, term) => {
    const principal = parseFloat(amount);
    const monthlyRate = parseFloat(rate) / 100 / 12;
    const numberOfPayments = parseFloat(term) * 12;

    if (
      isNaN(principal) ||
      isNaN(monthlyRate) ||
      isNaN(numberOfPayments) ||
      principal <= 0 ||
      monthlyRate <= 0 ||
      numberOfPayments <= 0
    ) {
      return null;
    }

    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;
    const annualPaymentMortgageConstant = (monthlyPayment * 12) / principal;

    return {
      monthlyPayment: formatter.format(monthlyPayment.toFixed(2)),
      totalPayment: formatter.format(totalPayment.toFixed(2)),
      totalInterest: formatter.format(totalInterest.toFixed(2)),
      annualPaymentMortgageConstant: formatter.format(
        (annualPaymentMortgageConstant * 100).toFixed(2)
      ),
      principalValue: principal,
      totalInterestValue: totalInterest,
    };
  }, []);

  const onSubmit = async (data) => {
    try {
      await AsyncStorage.setItem("loanAmount", data.loanAmount);
      await AsyncStorage.setItem("interestRate", data.interestRate);
      await AsyncStorage.setItem("loanTerm", data.loanTerm);
    } catch (error) {
      console.error("Failed to save data to AsyncStorage", error);
    }
  };

  const onReset = async () => {
    reset();
    setResults(null);
    try {
      await AsyncStorage.removeItem("loanAmount");
      await AsyncStorage.removeItem("interestRate");
      await AsyncStorage.removeItem("loanTerm");
    } catch (error) {
      console.error("Failed to remove data from AsyncStorage", error);
    }
  };

  const formatNumberWithCommas = (value) => {
    const number = value.replace(/[^0-9]/g, ""); // Remove any non-numeric characters
    return new Intl.NumberFormat("en-US").format(number);
  };

  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <Controller
            control={control}
            name="loanAmount"
            rules={{ required: "Loan amount is required" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.label}>Loan Amount</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 12,
                        marginRight: 5,
                        color: "#B0A695",
                      }}
                    >
                      MYR
                    </Text>
                  </View>
                </View>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => {
                    onChange(formatNumberWithCommas(text));
                    onSubmit({ ...watch(), loanAmount: text });
                  }}
                  onBlur={onBlur}
                  value={value}
                  keyboardType="numeric"
                  placeholder=""
                />
                {errors.loanAmount && (
                  <Text style={styles.error}>{errors.loanAmount.message}</Text>
                )}
              </View>
            )}
          />

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flex: 1, marginRight: 5 }}>
              <Controller
                control={control}
                name="interestRate"
                rules={{ required: "Interest rate is required" }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text style={styles.label}>Interest Rate</Text>
                      </View>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          style={{
                            fontWeight: "bold",
                            fontSize: 12,
                            marginRight: 5,
                            color: "#B0A695",
                          }}
                        >
                          %
                        </Text>
                      </View>
                    </View>
                    <TextInput
                      style={styles.input}
                      onChangeText={(text) => {
                        onChange(text);
                        onSubmit({ ...watch(), interestRate: text });
                      }}
                      onBlur={onBlur}
                      value={value}
                      keyboardType="numeric"
                      placeholder=""
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
            <View style={{ flex: 1, marginLeft: 5 }}>
              <Controller
                control={control}
                name="loanTerm"
                rules={{ required: "Loan term is required" }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text style={styles.label}>Loan Term</Text>
                      </View>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          style={{
                            fontWeight: "bold",
                            fontSize: 12,
                            marginRight: 5,
                            color: "#B0A695",
                          }}
                        >
                          YEARS
                        </Text>
                      </View>
                    </View>
                    <TextInput
                      style={styles.input}
                      onChangeText={(text) => {
                        onChange(text);
                        onSubmit({ ...watch(), loanTerm: text });
                      }}
                      onBlur={onBlur}
                      value={value}
                      keyboardType="numeric"
                      placeholder=""
                    />
                    {errors.loanTerm && (
                      <Text style={styles.error}>
                        {errors.loanTerm.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>
          </View>

          {results && (
            <>
              <View style={styles.resultsContainer}>
                <LoanPaymentPieChart
                  title="Loan Breakdown"
                  principal={results.principalValue}
                  totalInterest={results.totalInterestValue}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "col",
                    alignItems: "flex-start",
                  }}
                >
                  <Text style={styles.label}>Monthly Payment</Text>
                  <Text>MYR {results.monthlyPayment}</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "col",
                    alignItems: "flex-start",
                  }}
                >
                  <Text style={styles.label}>Mortgage Constant</Text>
                  <Text>{results.annualPaymentMortgageConstant}%</Text>
                </View>
              </View>
              <AmortizationSchedule
                loanAmount={parseFloat(loanAmount.replace(/,/g, ""))}
                interestRate={parseFloat(interestRate)}
                loanTerm={parseFloat(loanTerm)}
                navigation={navigation}
              />
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
    padding: 15,
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
    borderColor: "#B0A695",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5, //5
    fontSize: 16, //14
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
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#B0A695", // Green background
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff", // White text color
    fontSize: 16,
  },
});

export default LoanCalculatorScreen;
