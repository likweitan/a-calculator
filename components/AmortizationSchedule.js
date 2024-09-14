import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";

const AmortizationSchedule = ({ loanAmount, interestRate, loanTerm, navigation }) => {
  const calculateAmortizationSchedule = () => {
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    const monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    let balance = loanAmount;
    const schedule = [];

    for (let month = 1; month <= numberOfPayments; month++) {
      const interest = balance * monthlyRate;
      const principal = monthlyPayment - interest;
      balance -= principal;

      schedule.push({
        month,
        payment: monthlyPayment.toFixed(2),
        interest: interest.toFixed(2),
        principal: principal.toFixed(2),
        balance: Math.max(balance, 0).toFixed(2),
      });
    }
    return schedule;
  };

  const schedule = calculateAmortizationSchedule();

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.month}</Text>
      <Text style={styles.cell}>MYR {item.interest}</Text>
      <Text style={styles.cell}>MYR {item.principal}</Text>
      <Text style={styles.cell}>MYR {item.balance}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "col", alignItems: "baseline" }}>
          <Text style={styles.title}>Amortization Schedule</Text>
        </View>
        <View style={{ flexDirection: "col", alignItems: "baseline" }}>
        <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('LoanCalculatorItem', { schedule: schedule })}><Text style={styles.subtitle}>More</Text></TouchableOpacity>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    paddingTop: 10,
    marginTop: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#B0A695",
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
    marginRight: 10,
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

export default AmortizationSchedule;
