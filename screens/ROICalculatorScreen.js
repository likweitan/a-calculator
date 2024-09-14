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

const ROICalculatorScreen = () => {
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
      monthlyRental: "",
      annualExpenses: "",
      loanAmount: "",
      interestRate: "",
    },
  });

  const propertyPrice = watch("propertyPrice");
  const monthlyRental = watch("monthlyRental");
  const annualExpenses = watch("annualExpenses");
  const loanAmount = watch("loanAmount");
  const interestRate = watch("interestRate");

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedData = await AsyncStorage.multiGet([
          "propertyPrice",
          "monthlyRental",
          "annualExpenses",
          "loanAmount",
          "interestRate",
        ]);
        const loadedData = Object.fromEntries(savedData);
        if (Object.values(loadedData).every(Boolean)) {
          reset(loadedData);
        }
      } catch (error) {
        console.error("Failed to load data from AsyncStorage", error);
      }
    };

    loadData();
  }, [reset]);

  useEffect(() => {
    if (
      propertyPrice &&
      monthlyRental &&
      annualExpenses &&
      loanAmount &&
      interestRate
    ) {
      const newResults = calculateROI(
        propertyPrice.replace(/,/g, ""),
        monthlyRental.replace(/,/g, ""),
        annualExpenses.replace(/,/g, ""),
        loanAmount.replace(/,/g, ""),
        interestRate
      );
      if (JSON.stringify(newResults) !== JSON.stringify(results)) {
        setResults(newResults);
      }
    } else {
      setResults(null);
    }
  }, [
    propertyPrice,
    monthlyRental,
    annualExpenses,
    loanAmount,
    interestRate,
    calculateROI,
    results,
  ]);

  const calculateROI = useCallback((price, rental, expenses, loan, rate) => {
    const propertyValue = parseFloat(price);
    const monthlyRentalValue = parseFloat(rental);
    const annualExpensesValue = parseFloat(expenses);
    const loanValue = parseFloat(loan);
    const interestRateValue = parseFloat(rate);

    if (
      isNaN(propertyValue) ||
      isNaN(monthlyRentalValue) ||
      isNaN(annualExpensesValue) ||
      isNaN(loanValue) ||
      isNaN(interestRateValue) ||
      propertyValue <= 0 ||
      monthlyRentalValue <= 0 ||
      loanValue < 0 ||
      interestRateValue < 0
    ) {
      return null;
    }

    const annualRentalIncome = monthlyRentalValue * 12;

    // Gross Rental Yield
    const grossRentalYield = (annualRentalIncome / propertyValue) * 100;

    // Net Rental Yield
    const netRentalYield =
      ((annualRentalIncome - annualExpensesValue) / propertyValue) * 100;

    // Net Leveraged Rental Yield
    const annualInterest = (loanValue * interestRateValue) / 100;
    const capitalCost = propertyValue - loanValue;
    const netLeveragedRentalYield =
      ((annualRentalIncome - annualExpensesValue - annualInterest) /
        capitalCost) *
      100;

    return {
      grossRentalYield: grossRentalYield.toFixed(2),
      netRentalYield: netRentalYield.toFixed(2),
      netLeveragedRentalYield: netLeveragedRentalYield.toFixed(2),
      annualRentalIncome: formatter.format(annualRentalIncome.toFixed(2)),
      annualInterest: formatter.format(annualInterest.toFixed(2)),
      capitalCost: formatter.format(capitalCost.toFixed(2)),
    };
  }, []);

  const onSubmit = async (data) => {
    try {
      await AsyncStorage.multiSet(Object.entries(data));
    } catch (error) {
      console.error("Failed to save data to AsyncStorage", error);
    }
  };

  const formatNumberWithCommas = (value) => {
    const number = value.replace(/[^0-9.]/g, "");
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
        <ScrollView style={styles.container}>
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
                  placeholder=""
                />
                {errors.propertyPrice && (
                  <Text style={styles.error}>
                    {errors.propertyPrice.message}
                  </Text>
                )}
              </View>
            )}
          />
          
        <View style={styles.comparisonContainer}>
          <View style={styles.comparisonColumn}>
              <Controller
                control={control}
                name="monthlyRental"
                rules={{ required: "Monthly rental is required" }}
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
                        <Text style={styles.label}>Monthly Rental</Text>
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
                          MYR
                        </Text>
                      </View>
                    </View>
                    <TextInput
                      style={styles.input}
                      onChangeText={(text) => {
                        onChange(formatNumberWithCommas(text));
                        onSubmit({ ...watch(), monthlyRental: text });
                      }}
                      onBlur={onBlur}
                      value={value}
                      keyboardType="numeric"
                      placeholder=""
                    />
                    {errors.monthlyRental && (
                      <Text style={styles.error}>
                        {errors.monthlyRental.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>
            <View style={styles.comparisonColumn}>
              <Controller
                control={control}
                name="annualExpenses"
                rules={{ required: "Annual expenses are required" }}
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
                        <Text style={styles.label}>Annual Expenses</Text>
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
                          MYR
                        </Text>
                      </View>
                    </View>
                    <TextInput
                      style={styles.input}
                      onChangeText={(text) => {
                        onChange(formatNumberWithCommas(text));
                        onSubmit({ ...watch(), annualExpenses: text });
                      }}
                      onBlur={onBlur}
                      value={value}
                      keyboardType="numeric"
                      placeholder=""
                    />
                    {errors.annualExpenses && (
                      <Text style={styles.error}>
                        {errors.annualExpenses.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>
          </View>
          
        <View style={styles.comparisonContainer}>
          <View style={styles.comparisonColumn}>
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
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text style={styles.label}>Loan Amount</Text>
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
                      <Text style={styles.error}>
                        {errors.loanAmount.message}
                      </Text>
                    )}
                  </View>
                )}
              />
              </View>
              <View style={styles.comparisonColumn}>
              <Controller
                control={control}
                name="interestRate"
                rules={{ required: "" }}
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
          </View>
          {results && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultTitle}>ROI Calculation Results</Text>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Gross Rental Yield:</Text>
                <Text style={styles.resultValue}>
                  {results.grossRentalYield}% per annum
                </Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Net Rental Yield:</Text>
                <Text style={styles.resultValue}>
                  {results.netRentalYield}% per annum
                </Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>
                  Net Leveraged Rental Yield:
                </Text>
                <Text style={styles.resultValue}>
                  {results.netLeveragedRentalYield}% per annum
                </Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Annual Rental Income:</Text>
                <Text style={styles.resultValue}>
                  {results.annualRentalIncome}
                </Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Annual Interest:</Text>
                <Text style={styles.resultValue}>{results.annualInterest}</Text>
              </View>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Capital Cost:</Text>
                <Text style={styles.resultValue}>{results.capitalCost}</Text>
              </View>
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
    paddingVertical: 5,
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
    fontSize: 18,
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
  comparisonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  comparisonColumn: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default ROICalculatorScreen;
