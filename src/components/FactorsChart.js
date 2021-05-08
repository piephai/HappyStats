import { ThreeDRotationRounded } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

const FactorChart = (props) => {
  const [newData, setNewData] = useState(null);
  const [xAxis, setXAxis] = useState(null);
  const [yAxis, setYAxis] = useState(null);
  const [options, setOptions] = useState(null);
  const [chartTitle, setChartTitle] = useState(null);
  //   const [lineChart, setLineChart] = useState(true);

  const setAxis = () => {
    if (props.xData && props.yData) {
      //Create a new array of data with only 10 items maximum
      //   let countries = props.data.slice(0, 10).map((item) => {
      //     return item.country;
      //   });
      //   let years = props.data.slice(0, 10).map((item) => {
      //     return item.year;
      //   });
      setXAxis(props.xData);
      setYAxis(props.yData);
      setChartTitle(props.chartTitle);
      //   let score = props.data.slice(0, 10).map((item) => {
      //     return item.score;
      //   });
      //   if (props.data.length > 0) {
      //     let valuesAlreadySeen = [];
      //     let count = 0;

      //     //Check to see if there are duplicate values
      //     for (let i = 0; i < countries.length; i++) {
      //       if (valuesAlreadySeen.indexOf(countries[i]) !== -1) {
      //         break;
      //       }
      //       count++;
      //       valuesAlreadySeen.push(countries[i]);
      //     }
      //     //When there are no duplicate values then set title to top 10 happiest countries and xaxis to be countries
      //     if (count > 1) {
      //       setCountry("Top 10 Happiest Countries");
      //       setXAxis(countries);

      //       setLineChart(false);
      //     }
      //     //When there is even one duplicate value then set the title to the first country. This happens when a user fetch for only one country
      //     else {
      //       console.log("Where we got up to");
      //       setCountry(countries[0]);
      //       setXAxis(years);
      //       setLineChart(true);
      //     }
    }
    //If the length is not greater than 1 then that would mean that there is only one row of data thus it is assumed that the user fetched for only one country
    //   else {
    //     setCountry(countries[0]);
    //     setXAxis(years);
    //     setLineChart(true);
    //   }

    //   setYAxis(score);
  };

  const setData = () => {
    //Reverse the array so that it display from the lowest value first
    let xAxis_reversed = xAxis.reverse();
    let yAxis_reversed = yAxis.reverse();
    const data = {
      labels: xAxis_reversed.map((item) => {
        return item;
      }),

      datasets: [
        {
          label: chartTitle,
          aixs: "y",
          data: yAxis_reversed.map((item) => {
            return item;
          }),
          fill: false,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
        },
      ],
    };

    const options = {
      indexAxis: "y",
    };
    setNewData(data);
    setOptions(options);
  };

  //This use effect will happen everytime data changes in its parent component
  useEffect(() => {
    if (props.data.length > 0) {
      setAxis();
    }
  }, [props.xData, props.yData]);

  //This use effect will only happen when xAxis and yAxis changes. This is done to reload the components after the values had changed
  useEffect(() => {
    if (xAxis && yAxis) {
      setData();
    }
  }, [xAxis, yAxis]);

  return (
    <div>
      <Bar data={newData} options={options} height={500} width={500} />
    </div>
  );
};

export default FactorChart;
