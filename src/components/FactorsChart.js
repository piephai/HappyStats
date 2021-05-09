import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

const FactorChart = (props) => {
  const [newData, setNewData] = useState(null);
  const [xAxis, setXAxis] = useState(null);
  const [yAxis, setYAxis] = useState(null);
  const [options, setOptions] = useState(null);
  const [chartTitle, setChartTitle] = useState(null);

  //Set the axis for the charts
  const setAxis = () => {
    //Only try and set the axis if all the properties are not null
    if (props.xData && props.yData && props.chartTitle) {
      setXAxis(props.xData);
      setYAxis(props.yData);
      setChartTitle(props.chartTitle);
    }
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
          //Change it to a horizontal bar graph
          label: chartTitle,
          axis: "y",
          data: yAxis_reversed,
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

  //This use effect will happen everytime xdata and ydata changes in its parent component
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
