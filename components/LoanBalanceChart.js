import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { LineChart, YAxis, XAxis, Grid } from 'react-native-svg-charts';
import { G, Line, Text } from 'react-native-svg';

const LoanBalanceChart = ({ loanData }) => {
  const screenWidth = Dimensions.get('window').width;

  const balanceData = loanData.map(item => item.balance);
  const principalData = loanData.map(item => item.principal);
  const interestData = loanData.map(item => item.interest);

  const ContentInset = { top: 20, bottom: 20 };

  const CustomGrid = ({ x, y, data, ticks }) => (
    <G>
      {
        // Horizontal grid lines
        ticks.map(tick => (
          <Line
            key={tick}
            x1={'0%'}
            x2={'100%'}
            y1={y(tick)}
            y2={y(tick)}
            stroke={'rgba(0,0,0,0.2)'}
          />
        ))
      }
      {
        // Vertical grid lines
        data.map((_, index) => (
          <Line
            key={index}
            y1={'0%'}
            y2={'100%'}
            x1={x(index)}
            x2={x(index)}
            stroke={'rgba(0,0,0,0.2)'}
          />
        ))
      }
    </G>
  );

  const CustomLabel = ({ x, y, data }) => (
    <>
      {data.map((value, index) => (
        <Text
          key={index}
          x={x(index)}
          y={y(value) - 10}
          fontSize={10}
          fill={'black'}
          alignmentBaseline={'middle'}
          textAnchor={'middle'}
        >
          {value.toFixed(0)}
        </Text>
      ))}
    </>
  );

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        <YAxis
          data={balanceData}
          contentInset={ContentInset}
          svg={{
            fill: 'grey',
            fontSize: 10,
          }}
          numberOfTicks={10}
          formatLabel={(value) => `$${value.toFixed(0)}`}
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <LineChart
            style={{ flex: 1 }}
            data={balanceData}
            svg={{ stroke: 'rgb(134, 65, 244)' }}
            contentInset={ContentInset}
          >
            <Grid/>
            <CustomLabel/>
          </LineChart>
          <LineChart
            style={StyleSheet.absoluteFill}
            data={principalData}
            svg={{ stroke: 'rgb(255, 0, 0)' }}
            contentInset={ContentInset}
          >
            <CustomLabel/>
          </LineChart>
          <LineChart
            style={StyleSheet.absoluteFill}
            data={interestData}
            svg={{ stroke: 'rgb(0, 255, 0)' }}
            contentInset={ContentInset}
          >
            <CustomLabel/>
          </LineChart>
          <XAxis
            style={{ marginHorizontal: -10, height: 30 }}
            data={loanData}
            formatLabel={(value, index) => loanData[index].year}
            contentInset={{ left: 10, right: 10 }}
            svg={{ fontSize: 10, fill: 'black' }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    padding: 20,
    flexDirection: 'row'
  },
  chart: {
    flex: 1,
    flexDirection: 'row'
  }
});

export default LoanBalanceChart;