import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

import DropdownMenu from "../Dropdown";
import "./Ranking.css";
import BarChart from "../RankingChart";

const Ranking = () => {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [year, setYear] = useState("2020");
  const [country, setCountry] = useState("All");
  const [countries, setCountries] = useState([]);
  const [showGrid, setShowGrid] = useState(false);
  const [error, setError] = useState(null);
  const [colourIntensity, setColourIntensity] = useState("0.7");

  const years = ["All", "2020", "2019", "2018", "2017", "2016", "2015"];
  const colourIntensities = [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];

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
  }

  const onFilterTextChange = (e) => {
    gridApi.setQuickFilter(e.target.value);
  };

  const onFirstDataRendered = (params) => {
    if (params) {
      params.api.sizeColumnsToFit();
    }
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
          //Insert "All" at the front of the array
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
              <DropdownMenu
                className="colour-intensity"
                selection={colourIntensity}
                items={colourIntensities}
                onSelection={setColourIntensity}
                menuTitle="Chart Transparency"
              />
            </div>

            <div className="grid-holder">
              <div className="ag-theme-alpine">
                <AgGridReact
                  columnDefs={columns}
                  onGridReady={onGridReady}
                  defaultColDef={{ flex: 1 }}
                  rowData={rowData}
                  className="ranking-grid"
                  onFirstDataRendered={onFirstDataRendered}
                />
              </div>
            </div>

            <div className="bar-chart-container">
              <BarChart
                data={rowData}
                xType="country"
                yType="score"
                chartTitle="Top 10 Happiest Countries"
                colourIntensity={colourIntensity}
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
              Please check your connection and try again
            </Typography>
          </div>
        )}
      </div>
    </>
  );
};

export default Ranking;
