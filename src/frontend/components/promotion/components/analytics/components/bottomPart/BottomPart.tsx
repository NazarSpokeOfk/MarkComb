import "./BottomPart.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";

import { DateRange } from "react-date-range";

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

import Divider from "../divider/Divider";
import InformationBlock from "../informationBlock/InformationBlock";

import loading from "../../../../images/loading-gif.gif";

const BottomPart = ({}) => {
  const { t } = useTranslation();
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection" as const,
    },
  ]);

  const data = [
    { date: "2025-09-01", views: 400, likes: 24, comments: 2 },
    { date: "2025-09-02", views: 300, likes: 13, comments: 5 },
    { date: "2025-09-03", views: 200, likes: 98, comments: 10 },
    { date: "2025-09-04", views: 278, likes: 39, comments: 7 },
    { date: "2025-09-05", views: 189, likes: 48, comments: 4 },
  ];

  return (
    <>
    <Divider text="select a span" />
      <div className="bottom__part-first_block">
        <DateRange
          rangeColors={["#000"]}
          editableDateInputs={false}
          moveRangeOnFirstSelection={false}
          ranges={range}
          onChange={(item) => {
            setRange([
              {
                startDate: item.selection.startDate ?? new Date(),
                endDate: item.selection.endDate ?? new Date(),
                key: "selection",
              },
            ]);
          }}
        />

        <ResponsiveContainer width={"100%"} height={400}>
          {/* <div className="blur-shimmer"></div> */}
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="views" name={t("views")} stroke="#FF0000" />
            <Line type="monotone" dataKey="likes" name={t("likes")} stroke="#11880A" />
            <Line type="monotone" dataKey="comments" name={t("comments")} stroke="#FF6600" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="information__block-flex">
      <InformationBlock/>
      <InformationBlock isBlack="black"/>
      <InformationBlock/>
      </div>
    </>

  );
};
export default BottomPart;
