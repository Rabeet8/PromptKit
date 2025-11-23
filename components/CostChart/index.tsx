import React from "react";
import { View, Dimensions } from "react-native";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
} from "victory-native";

interface CostChartProps {
  daily: number;
  monthly: number;
  yearly: number;
}

const screenWidth = Dimensions.get("window").width;

const CostChart: React.FC<CostChartProps> = ({
  daily,
  monthly,
  yearly,
}) => {
  const data = [
    { label: "Daily", value: daily },
    { label: "Monthly", value: monthly },
    { label: "Yearly", value: yearly },
  ];

  return (
    <View style={{ marginTop: 20 }}>
      <VictoryChart
        width={screenWidth - 20}
        domainPadding={{ x: 40 }}
        theme={VictoryTheme.material}
      >
        <VictoryAxis
          style={{
            tickLabels: {
              fill: "#8C877F",
              fontSize: 13,
            },
          }}
        />

        <VictoryAxis
          dependentAxis
          style={{
            grid: { stroke: "#EFEDE8" },
            tickLabels: { fill: "#8C877F", fontSize: 12 },
          }}
        />

        <VictoryBar
          data={data}
          x="label"
          y="value"
          barWidth={28}
          cornerRadius={{ top: 6, bottom: 0 }}
          style={{
            data: { fill: "#2D2A26" },
          }}
          animate={{ duration: 700, easing: "easeInOut" }}
        />
      </VictoryChart>
    </View>
  );
};

export default CostChart;
