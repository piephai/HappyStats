import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import React, { useEffect, useState, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Badge } from "reactstrap";
import Typography from "@material-ui/core/Typography";
import "./Ranking.css";
import TextField from "@material-ui/core/TextField";
import DropdownMenu from "../Dropdown";
import Paper from "@material-ui/core/Paper";
import { Chart } from "chart.js";
import BarChart from "../RankingChart";

const Ranking = () => {
  const [numCountries, setNumCountries] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [year, setYear] = useState("2020");
  const [country, setCountry] = useState("All");
  const [countries, setCountries] = useState([]);
  const [showGrid, setShowGrid] = useState(false);
  const [error, setError] = useState(null);

  const years = ["All", "2020", "2019", "2018", "2017", "2016", "2015"];
  const columns = [
    { headerName: "Rank", field: "rank", sortable: true, filter: true },
    { headerName: "Country", field: "country", sortable: true, filter: true },
    { headerName: "Score", field: "score", sortable: true, filter: true },
    { headerName: "Year", field: "year", sortable: true, filter: true },
  ];

  const handleErrors = (response) => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response;
  };

  function onGridReady(params) {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    setNumCountries(params.api.getDisplayedRowCount());
  }

  const onFilterTextChange = (e) => {
    gridApi.setQuickFilter(e.target.value);
    setNumCountries(gridApi.getDisplayedRowCount());
  };

  useEffect(() => {
    let initialCountries = [];
    if (countries.length <= 0) {
      fetch(`http://131.181.190.87:3000/countries`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      })
        .then(handleErrors)
        .then((res) => res.json())
        .then((data) => {
          initialCountries = data.map((dataCountry) => {
            return dataCountry;
          });
          initialCountries.unshift("All");
          setCountries(initialCountries);
        })
        .catch((err) => {
          if (err.message === "400") {
            setShowGrid(false);
            setError(`Invalid format`);
          } else {
            setShowGrid(false);
            setError(`Timed out`);
          }
        });
    }
  }, []);

  useEffect(() => {
    //If user has selected 'All' as the option for year
    if (year === "All") {
      //If user has selected 'All' as the option for country
      if (country === "All") {
        fetch(`http://131.181.190.87:3000/rankings?`)
          .then(handleErrors)
          .then((res) => res.json())
          .then((data) =>
            data.map((ranking) => {
              return {
                rank: ranking.rank,
                country: ranking.country,
                score: ranking.score,
                year: ranking.year,
              };
            })
          )
          .then((rankings) => {
            setRowData(rankings);
            setShowGrid(true);
          })
          .catch((err) => {
            if (err.message === "400") {
              setShowGrid(false);
              setError(`Invalid format`);
            } else {
              setShowGrid(false);
              setError(`Timed out`);
            }
          });
      } else {
        {
          fetch(`http://131.181.190.87:3000/rankings?&country=${country}`)
            .then(handleErrors)
            .then((res) => res.json())
            .then((data) =>
              data.map((ranking) => {
                return {
                  rank: ranking.rank,
                  country: ranking.country,
                  score: ranking.score,
                  year: ranking.year,
                };
              })
            )
            .then((rankings) => {
              setRowData(rankings);
              setShowGrid(true);
            })
            .catch((err) => {
              if (err.message === "400") {
                setShowGrid(false);
                setError(`Invalid format`);
              } else {
                setShowGrid(false);
                setError(`Timed out`);
              }
            });
        }
      }
    } else {
      if (country === "All") {
        fetch(`http://131.181.190.87:3000/rankings?year=${year}`)
          .then(handleErrors)
          .then((res) => res.json())
          .then((data) =>
            data.map((ranking) => {
              return {
                rank: ranking.rank,
                country: ranking.country,
                score: ranking.score,
                year: ranking.year,
              };
            })
          )
          .then((rankings) => {
            setRowData(rankings);
            setShowGrid(true);
          })
          .catch((err) => {
            if (err.message === "400") {
              setShowGrid(false);
              setError(`Invalid format`);
            } else {
              setShowGrid(false);
              setError(`Timed out`);
            }
          });
      } else {
        fetch(
          `http://131.181.190.87:3000/rankings?year=${year}&country=${country}`
        )
          .then(handleErrors)
          .then((res) => res.json())
          .then((data) =>
            data.map((ranking) => {
              return {
                rank: ranking.rank,
                country: ranking.country,
                score: ranking.score,
                year: ranking.year,
              };
            })
          )
          .then((rankings) => {
            setRowData(rankings);
            setShowGrid(true);
          })
          .catch((err) => {
            if (err.message === "400") {
              setShowGrid(false);
              setError(`Invalid format`);
            } else {
              setShowGrid(false);
              setError(`Timed out`);
            }
          });
      }
    }
  }, [year, country]);

  return (
    <>
      <div className="ranking-container">
        {showGrid ? (
          <>
            <div className="ranking-title">
              <Typography
                component="h1"
                variant="h2"
                align="center"
                color="textPrimary"
                gutterBottom
              >
                World Happiness Ranking
              </Typography>
            </div>

            <div className="search-div">
              <TextField
                id="outlined-basic"
                label="Search table..."
                variant="outlined"
                onChange={onFilterTextChange}
                size="small"
              />
              <DropdownMenu
                className="year-dropdown"
                selection={year}
                items={years}
                onSelection={setYear}
                menuTitle="Year"
              />
              <DropdownMenu
                className="country-dropdown"
                selection={country}
                items={countries}
                onSelection={setCountry}
                menuTitle="Country"
              />
            </div>

            <div className="ag-theme-alpine">
              <AgGridReact
                columnDefs={columns}
                onGridReady={onGridReady}
                defaultColDef={{ flex: 1 }}
                rowData={rowData}
                className="ranking-grid"
              />
              <p>
                There is <Badge color="success"> {numCountries}</Badge> rows
              </p>
            </div>

            <div className="bar-chart-container">
              <BarChart
                data={rowData}
                xType="country"
                yType="score"
                chartTitle="Top 10 Happiest Countries"
              />
            </div>
          </>
        ) : (
          <div className="no-data-content">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
              padding-top="2px"
            >
              Oops
            </Typography>

            <Typography
              component="h3"
              variant="h4"
              align="center"
              color="textPrimary"
              gutterBottom
              padding-top="2px"
            >
              It seems like you may not be connected to the internet
            </Typography>
            <Typography
              component="h3"
              variant="h4"
              align="center"
              color="textPrimary"
              gutterBottom
              padding-top="2px"
            >
              Please check your connection and refresh page
            </Typography>
          </div>
        )}
      </div>
    </>
  );
};

export default Ranking;
