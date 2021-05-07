// import { _ } from "ag-grid-community";
import { ThreeDRotationRounded } from "@material-ui/icons";
import React, { useEffect, useState, useMemo } from "react";
import { Bar, Line } from "react-chartjs-2";

const BarChart = (props) => {
  const [newData, setNewData] = useState(null);
  const [xAxis, setXAxis] = useState(null);
  const [yAxis, setYAxis] = useState(null);
  const [options, setOptions] = useState(null);
  const [country, setCountry] = useState(null);
  const [lineChart, setLineChart] = useState(true);

  const setAxis = () => {
    if (props.data) {
      if (props.data.length > 0) {
        let valuesAlreadySeen = [];
        let count = 0;
        for (let i = 0; i < props.data.length; i++) {
          if (valuesAlreadySeen.indexOf(props.data[i].country) !== -1) {
            break;
          }
          count++;
          valuesAlreadySeen.push(props.data[i].country);
        }
        if (count > 1) {
          setCountry("Top 10 Happiest Countries");
          setXAxis(
            props.data.slice(0, 10).map((item) => {
              return item.country;
            })
          );
          setLineChart(false);
        } else {
          setCountry(props.data[0].country);
          setXAxis(
            props.data.slice(0, 10).map((item) => {
              return item.year;
            })
          );
          setLineChart(true);
        }
      } else {
        setCountry(props.data[0].country);
        setXAxis(
          props.data.slice(0, 10).map((item) => {
            return item.year;
          })
        );
        setLineChart(true);
      }

      setYAxis(
        props.data.slice(0, 10).map((item) => {
          return item.score;
        })
      );
    }
  };

  const setData = () => {
    let xAxis_reversed = xAxis.reverse();
    let yAxis_reversed = yAxis.reverse();
    const data = {
      labels: xAxis_reversed.map((item) => {
        return item;
      }),

      datasets: [
        {
          label: country,
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
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: false,
            },
          },
        ],
      },
    };
    setNewData(data);
    setOptions(options);
  };

  useEffect(() => {
    setAxis();
    // props.barChange(true);
  }, [props.data]);

  useEffect(() => {
    if (xAxis && yAxis) {
      setData();
    }
  }, [xAxis, yAxis]);

  return (
    <div>
      {lineChart ? (
        <Line data={newData} options={options} height={500} width={750} />
      ) : (
        <Bar data={newData} options={options} height={500} width={750} />
      )}
    </div>
  );
};

export default BarChart;
