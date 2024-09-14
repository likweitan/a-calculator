import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const LoanPaymentChart = ({ title, principal, totalInterest }) => {
  const total = principal + totalInterest;
  const principalPercentage = (principal / total) * 100;
  const interestPercentage = (totalInterest / total) * 100;

  const animatedPrincipalWidth = useSharedValue(0);
  const animatedInterestWidth = useSharedValue(0);

  useEffect(() => {
    animatedPrincipalWidth.value = withTiming(principalPercentage, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
    animatedInterestWidth.value = withTiming(interestPercentage, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
  }, [principalPercentage, interestPercentage]);

  const principalStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedPrincipalWidth.value}%`,
    };
  });

  const interestStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedInterestWidth.value}%`,
    };
  });

  return (
    <View style={{ marginTop: 10, marginBottom: 10 }}>
      <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
        {title}
      </Text>
      <View style={{ flexDirection: "row", height: 20, marginBottom: 10 }}>
        <Animated.View
          style={[
            {
              backgroundColor: "#776B5D",
              flexDirection: "row",
              justifyContent: "center",
              borderTopLeftRadius: 5,
              borderBottomLeftRadius: 5,
            },
            principalStyle
          ]}
        >
          <Text style={{ fontSize: 14, color: "#fff", fontWeight: "bold" }}>
            {principalPercentage.toFixed(1)}%
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
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              width: 10,
              height: 10,
              backgroundColor: "#776B5D",
              marginRight: 5,
              borderRadius: 2.5,
            }}
          />
          <Text style={{ fontWeight: "bold" }}>Principal</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontWeight: "bold" }}>Interest</Text>
          <View
            style={{
              width: 10,
              height: 10,
              backgroundColor: "#B0A695",
              marginLeft: 5,
              borderRadius: 2.5,
            }}
          />
        </View>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ width: 10, height: 10, marginRight: 5 }} />
          <Text>MYR {principal.toFixed(2)}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text>MYR {totalInterest.toFixed(2)}</Text>
          <View style={{ width: 10, height: 10, marginLeft: 5 }} />
        </View>
      </View>
    </View>
  );
};

export default LoanPaymentChart;