import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const LineChart = ({ title, subtitle, value, totalInterest, unit, text_b, text_a }) => {
  const total = value + totalInterest;
  const valuePercentage = (value / total) * 100;
  const interestPercentage = (totalInterest / total) * 100;

  const animatedValueWidth = useSharedValue(0);
  const animatedInterestWidth = useSharedValue(0);

  useEffect(() => {
    animatedValueWidth.value = withTiming(valuePercentage, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
    animatedInterestWidth.value = withTiming(interestPercentage, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
  }, [valuePercentage, interestPercentage]);

  const valueStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedValueWidth.value}%`,
    };
  });

  const interestStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedInterestWidth.value}%`,
    };
  });

  return (
    <>
    <View style={{ marginTop: 5, marginBottom: 5 }}>
      {/* <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
        {title}
      </Text> */}
      {/* <View style={styles.resultsContainer}>
      <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>{subtitle}</Text>
                <Text style={styles.resultValue}>{unit} {value.toFixed(2)}</Text>
              </View>
      </View> */}
      <View style={{ flexDirection: "row", height: 20, marginBottom: 0 }}>
        <Animated.View
          style={[
            {
              backgroundColor: "#776B5D",
              flexDirection: "row",
              justifyContent: "center",
              borderTopLeftRadius: 5,
              borderBottomLeftRadius: 5,
            },
            valueStyle
          ]}
        >
          <Text style={{ fontSize: 14, color: "#fff", fontWeight: "bold" }}>
            {valuePercentage.toFixed(1)}%
          </Text>
        </Animated.View>
        <Animated.View
          style={[
            {
              backgroundColor: "#B0A695",
              flexDirection: "row",
              justifyContent: "center",
              borderTopRightRadius: 5,
              borderBottomRightRadius: 5,
            },
            interestStyle
          ]}
        >
          <Text style={{ fontSize: 14, color: "#fff", fontWeight: "bold" }}>
            {interestPercentage.toFixed(1)}%
          </Text>
        </Animated.View>
      </View>
    </View>
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 10,
              height: 10,
              backgroundColor: "#776B5D",
              marginRight: 5,
            }}
          />
          <Text style={{ fontWeight: "bold" }}>{text_a}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontWeight: "" }}>{unit} {value.toFixed(2)}</Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 10,
              height: 10,
              backgroundColor: "#B0A695",
              marginRight: 5,
            }}
          />
          <Text style={{ fontWeight: "bold" }}>{text_b}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontWeight: "" }}>{unit} {totalInterest}</Text>
        </View>
      </View>
    </>
  );
};

export default LineChart;

const styles = StyleSheet.create({
  resultLabel: {
    fontSize: 14,
    fontWeight: "bold",
  },
  resultValue: {
    fontSize: 14,
  },
  resultsContainer: {
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
});