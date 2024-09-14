import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart } from 'react-native-chart-kit';


const LoanComparisonScreen = () => {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      loanAmount: '',
      loanTerm1: '',
      interestRate1: '',
      loanTerm2: '',
      interestRate2: '',
    },
  });

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
    const annualPayment = monthlyPayment * 12;

    return {
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      annualPayment: annualPayment.toFixed(2),
    };
  }, []);

  const onCalculate = useCallback(() => {
    const data = getValues();
    const result1 = calculateLoan(data.loanAmount, data.interestRate1, data.loanTerm1);
    const result2 = calculateLoan(data.loanAmount, data.interestRate2, data.loanTerm2);

    if (result1 && result2) {
      setResults({ result1, result2 });
    } else {
      setResults(null);
    }
  }, [calculateLoan, getValues]);

  // Effect to load data from AsyncStorage on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const keys = ['loanAmount', 'loanTerm1', 'interestRate1', 'loanTerm2', 'interestRate2'];
        const storedData = await AsyncStorage.multiGet(keys);
        storedData.forEach(([key, value]) => {
          if (value) {
            setValue(key, value);
          }
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load data from AsyncStorage', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, [setValue]);

  // Effect to calculate results when form values change
  useEffect(() => {
    if (!isLoading) {
      onCalculate();
    }
  }, [isLoading, onCalculate]);

  // Function to save data to AsyncStorage
  const saveData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Failed to save data to AsyncStorage', error);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'MYR',
    }).format(value);
  };

  const renderInput = (name, label, rules = {}, symbol) => (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value } }) => (
        <View style={styles.inputContainer}>
            <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.label}>{label}</Text>
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
                      {symbol}
                    </Text>
                  </View>
                </View>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              onChange(text);
              saveData(name, text);
              onCalculate();
            }}
            onBlur={onBlur}
            value={value}
            keyboardType="numeric"
            // placeholder={`Enter ${label.toLowerCase()}`}
          />
          {errors[name] && (
            <Text style={styles.error}>{errors[name].message}</Text>
          )}
        </View>
      )}
    />
  );

  const renderBarChart = () => {
    if (!results) return null;
  
    const data = {
      labels: ['Monthly', 'Annual', 'Total', 'Interest'],
      datasets: [
        {
          label: 'Scenario 1',
          data: [
            parseFloat(results.result1.monthlyPayment),
            parseFloat(results.result1.annualPayment),
            parseFloat(results.result1.totalPayment),
            parseFloat(results.result1.totalInterest),
          ],
          color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`, // Blue for Scenario 1
        },
        {
          label: 'Scenario 2',
          data: [
            parseFloat(results.result2.monthlyPayment),
            parseFloat(results.result2.annualPayment),
            parseFloat(results.result2.totalPayment),
            parseFloat(results.result2.totalInterest),
          ],
          color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, // Red for Scenario 2
        },
      ],
    };
  
    return (
      <BarChart
        data={data}
        width={350}
        height={220}
        yAxisLabel="MYR "
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          barPercentage: 0.5, // Adjusts the width of bars
          stackedBar: true, // Enables stacked bar chart
        }}
        verticalLabelRotation={30} // Rotate labels to avoid overlap
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
    );
  };
  

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {renderInput('loanAmount', 'Loan Amount', { required: 'Loan amount is required' }, 'MYR')}

        <View style={styles.comparisonContainer}>
          <View style={styles.comparisonColumn}>
            <Text style={styles.columnTitle}>Scenario 1</Text>
            {renderInput('loanTerm1', 'Loan Term', { required: 'Loan term is required' }, 'YEARS')}
            {renderInput('interestRate1', 'Interest Rate', { required: 'Interest rate is required' }, '%')}
          </View>

          <View style={styles.comparisonColumn}>
            <Text style={styles.columnTitle}>Scenario 2</Text>
            {renderInput('loanTerm2', 'Loan Term', { required: 'Loan term is required' }, 'YEARS')}
            {renderInput('interestRate2', 'Interest Rate', { required: 'Interest rate is required' }, '%')}
          </View>
        </View>

        {results && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultTitle}>Comparison Results</Text>
            {/* {renderBarChart()} */}
            <View style={styles.comparisonContainer}>
              <View style={styles.resultColumn}>
                <Text style={styles.columnTitle}></Text>
                <Text style={styles.resultSubtitle}>Monthly Payment</Text>
                <Text style={styles.resultSubtitle}>Total Payment</Text>
                <Text style={styles.resultSubtitle}>Total Interest</Text>
                <Text style={styles.resultSubtitle}>Annual Payment</Text>
              </View>
              <View style={styles.resultColumn}>
                <Text style={styles.columnTitle}>Scenario 1</Text>
                <Text style={styles.resultText}>{formatCurrency(results.result1.monthlyPayment)}</Text>
                <Text style={styles.resultText}>{formatCurrency(results.result1.totalPayment)}</Text>
                <Text style={styles.resultText}>{formatCurrency(results.result1.totalInterest)}</Text>
                <Text style={styles.resultText}>{formatCurrency(results.result1.annualPayment)}</Text>
              </View>
              <View style={styles.resultColumn}>
                <Text style={styles.columnTitle}>Scenario 2</Text>
                <Text style={styles.resultText}>{formatCurrency(results.result2.monthlyPayment)}</Text>
                <Text style={styles.resultText}>{formatCurrency(results.result2.totalPayment)}</Text>
                <Text style={styles.resultText}>{formatCurrency(results.result2.totalInterest)}</Text>
                <Text style={styles.resultText}>{formatCurrency(results.result2.annualPayment)}</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
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
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#B0A695',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5, //5
    fontSize: 16,
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
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
  resultColumn: {
    flex: 0,
    marginHorizontal: 1,
  },
  columnTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#776B5D'
  },
  resultsContainer: {
    borderTopWidth: 1,
    borderColor: '#B0A695',
    paddingTop: 10,
    borderBottomWidth: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 14,
    marginBottom: 5,
    textAlign: "right",
    minHeight: 20
  },
  resultSubtitle: {
    fontSize: 14,
    textAlign: "left",
    fontWeight: "bold",
    marginBottom: 5,
    minHeight: 20
  },
});

export default LoanComparisonScreen;