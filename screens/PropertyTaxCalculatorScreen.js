import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LineChart from "../components/LineChart";

const PropertyTaxCalculatorScreen = ({ navigation }) => {
  const [results, setResults] = useState(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      propertyPrice: "",
      loanAmount: "",
    },
  });

  const propertyPrice = watch("propertyPrice");
  const loanAmount = watch("loanAmount");

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedPropertyPrice = await AsyncStorage.getItem("propertyPrice");
        const savedLoanAmount = await AsyncStorage.getItem("loanAmount");

        if (savedPropertyPrice && savedLoanAmount) {
          reset({
            propertyPrice: savedPropertyPrice,
            loanAmount: savedLoanAmount,
          });
        }
      } catch (error) {
        console.error("Failed to load data from AsyncStorage", error);
      }
    };

    loadData();
  }, [reset]);

  useEffect(() => {
    if (propertyPrice && loanAmount) {
      const newResults = calculateTaxes(
        propertyPrice.replace(/,/g, ""),
        loanAmount.replace(/,/g, "")
      );
      if (JSON.stringify(newResults) !== JSON.stringify(results)) {
        setResults(newResults);
      }
    } else {
      setResults(null);
    }
  }, [propertyPrice, loanAmount, calculateTaxes, results]);

  const calculateTaxes = useCallback((price, loan) => {
    const propertyValue = parseFloat(price);
    const loanValue = parseFloat(loan);

    if (
      isNaN(propertyValue) ||
      isNaN(loanValue) ||
      propertyValue <= 0 ||
      loanValue <= 0
    ) {
      return null;
    }

    // Legal Fee Calculation
    let legalFee = 0;
    if (propertyValue <= 500000) {
      legalFee = propertyValue * 0.0125;
    } else if (propertyValue <= 7500000) {
      legalFee = 500000 * 0.0125 + (propertyValue - 500000) * 0.01;
    } else {
      legalFee =
        500000 * 0.0125 + 7000000 * 0.01 + (propertyValue - 7500000) * 0.01;
    }

    // Stamp Duty S&P/Transfer Calculation
    let stampDutySP = 0;
    if (propertyValue <= 100000) {
      stampDutySP = propertyValue * 0.01;
    } else if (propertyValue <= 500000) {
      stampDutySP = 100000 * 0.01 + (propertyValue - 100000) * 0.02;
    } else if (propertyValue <= 1000000) {
      stampDutySP =
        100000 * 0.01 + 400000 * 0.02 + (propertyValue - 500000) * 0.03;
    } else {
      stampDutySP =
        100000 * 0.01 +
        400000 * 0.02 +
        500000 * 0.03 +
        (propertyValue - 1000000) * 0.04;
    }

    // Stamp Duty Loan Calculation
    const stampDutyLoan = loanValue * 0.005;

    return {
      legalFee: formatter.format(legalFee.toFixed(2)),
      stampDutySP: formatter.format(stampDutySP.toFixed(2)),
      stampDutyLoan: formatter.format(stampDutyLoan.toFixed(2)),
      totalCost: formatter.format(
        (legalFee + stampDutySP + stampDutyLoan).toFixed(2)
      ),
      legalFeeValue: legalFee,
      stampDutySPValue: stampDutySP,
      stampDutyLoanValue: stampDutyLoan,
      totalCostValue: legalFee + stampDutySP + stampDutyLoan,
    };
  }, []);

  const onSubmit = async (data) => {
    try {
      await AsyncStorage.setItem("propertyPrice", data.propertyPrice);
      await AsyncStorage.setItem("loanAmount", data.loanAmount);
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
    currency: "MYR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* <Text style={styles.title}>Property Tax Calculator</Text> */}

          <Controller
            control={control}
            name="propertyPrice"
            rules={{ required: "Property price is required" }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.label}>Property Price</Text>
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
                    onSubmit({ ...watch(), propertyPrice: text });
                  }}
                  onBlur={onBlur}
                  value={value}
                  keyboardType="numeric"
                  placeholder="Enter property price"
                />
                {errors.propertyPrice && (
                  <Text style={styles.error}>
                    {errors.propertyPrice.message}
                  </Text>
                )}
              </View>
            )}
          />

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
                  placeholder="Enter loan amount"
                />
                {errors.loanAmount && (
                  <Text style={styles.error}>{errors.loanAmount.message}</Text>
                )}
              </View>
            )}
          />

          {results && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultTitle}>Property Tax Breakdown</Text>
              {/* <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Total Legal Fees Payable</Text>
                <Text style={styles.resultValue}>{results.legalFee}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Total Stamp Duty Payable (S&P/Transfer)</Text>
                <Text style={styles.resultValue}>{results.stampDutySP}</Text>
              </View><View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Total Stamp Duty Payable (Loan)</Text>
                <Text style={styles.resultValue}>{results.stampDutyLoan}</Text>
              </View> */}
              {/* <LineChart
                  title="Fuel Economy"
                  subtitle="Total Stamp Duty Payable (S&P/Transfer)"
                  value={results.stampDutySPValue}
                  totalInterest={10000}
                  unit=""
                />
              <LineChart
                  title="Fuel Economy"
                  subtitle="Total Stamp Duty Payable (Loan)"
                  value={results.stampDutyLoanValue}
                  totalInterest={10000}
                  unit=""
                /> */}
              {/* <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Total Payable</Text>
                <Text style={styles.resultValue}>{results.totalCost}</Text>
              </View> */}
              <LineChart
                title="Fuel Economy"
                subtitle=""
                value={results.legalFeeValue}
                totalInterest={results.stampDutyLoanValue}
                unit="MYR"
                text_b="Total Stamp Duty Payable"
                text_a="Total Legal Fees Payable"
              />
            </View>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
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
    fontSize: 16,
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
    paddingTop: 10,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: "bold",
  },
  resultValue: {
    fontSize: 14,
  },
});

export default PropertyTaxCalculatorScreen;
