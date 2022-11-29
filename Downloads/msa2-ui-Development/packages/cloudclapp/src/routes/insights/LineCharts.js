import React from "react";
import { useTranslation } from "react-i18next";
import { Typography, makeStyles } from "@material-ui/core";
import { COLOR_MAP } from "cloudclapp/src/Constants";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const useStyles = makeStyles(() => {
  return {
    yAxisUnit: {
      marginLeft: 64,
    },
  };
});

const LineCharts = ({ data, vendor }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  //   const random_hex_color_code = () => {
  //     const n = (Math.random() * 0xfffff * 1000000).toString(16);
  //     return "#" + n.slice(0, 6);
  //   };

  //   const COLOR_MAP = [];

  //   for (let i = 0; i < vendor.length; i++) {
  //     COLOR_MAP.push(random_hex_color_code());
  //   }

  // currency formatter
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <>
      <Typography className={classes.yAxisUnit}>{t("USD")}</Typography>
      <ResponsiveContainer height={500} width={"100%"}>
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            formatter={(value) => formatter.format(value).slice(0, -3)}
          />
          <Legend />
          {vendor.map(([, { displayName }], i) => (
            <Line
              type="monotone"
              key={i}
              dataKey={displayName}
              stackId="a"
              stroke={COLOR_MAP[i]}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default LineCharts;
