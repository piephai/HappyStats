import React, { useContext, useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

import { UserContext } from "../context/UserContext";
import DropdownMenu from "../Dropdown";
import FactorChart from "../FactorsChart";
import "./Factors.css";

const Factors = () => {
  const { user, setUser } = useContext(UserContext);
  const [numCountries, setNumCountries] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [error, setError] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [year, setYear] = useState("2020");
  const [showGrid, setShowGrid] = useState(false);
  const [unauthorisedError, setUnauthorisedError] = useState(false);

  const years = ["2020", "2019", "2018", "2017", "2016", "2015"];

  const columns = [
    {
      headerName: "Rank",
      field: "rank",
      sortable: true,
      filter: true,
      minWidth: 70,
      maxWidth: 90,
    },
    {
      headerName: "Country",
      field: "country",
      sortable: true,
      filter: true,
      minWidth: 70,
    },
    {
      headerName: "Score",
      field: "score",
      sortable: true,
      filter: true,
      minWidth: 70,
    },
    {
      headerName: "Economy",
      field: "economy",
      sortable: true,
      filter: true,
      minWidth: 70,
    },
    {
      headerName: "Family",
      field: "family",
      sortable: true,
      filter: true,
      minWidth: 70,
    },
    {
      headerName: "Health",
      field: "health",
      sortable: true,
      filter: true,
      minWidth: 70,
    },
    {
      headerName: "Freedom",
      field: "freedom",
      sortable: true,
      filter: true,
      minWidth: 70,
    },
    {
      headerName: "Generosity",
      field: "generosity",
      sortable: true,
      filter: true,
      minWidth: 70,
    },
    {
      headerName: "Trust",
      field: "trust",
      sortable: true,
      filter: true,
      minWidth: 70,
    },
  ];

  //If the response is not okay then throw an error with the response status code
  const handleErrors = (response) => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response;
  };

  //Access the AG grid API to update the current grid
  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    setNumCountries(params.api.getDisplayedRowCount());
    onFirstDataRendered();
  };

  //Update the grid api filter
  const onFilterTextChange = (e) => {
    gridApi.setQuickFilter(e.target.value);
    setNumCountries(gridApi.getDisplayedRowCount());
  };

  const onFirstDataRendered = (params) => {
    if (params) {
      params.api.sizeColumnsToFit();
    }
  };

  //Rerender when the year or showGrid value changes
  useEffect(() => {
    if (user) {
      setUnauthorisedError(false);
      fetch(`http://131.181.190.87:3000/factors/${year}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `${user.token_type} ${user.token}`,
        },
      })
        //First check to see if the response was successful
        .then(handleErrors)
        .then((res) => res.json())
        .then((data) =>
          data.map((factors) => {
            //Return the data back into the form that we need it for the table
            return {
              rank: factors.rank,
              country: factors.country,
              score: factors.score,
              economy: factors.economy,
              family: factors.family,
              health: factors.health,
              freedom: factors.freedom,
              generosity: factors.generosity,
              trust: factors.trust,
            };
          })
        )
        .then((factors) => setRowData(factors))
        .catch((err) => {
          if (err.message === "400") {
            setShowGrid(false);
            setError(`Invalid year format. Format but must yyyy`);
          } else {
            setUnauthorisedError(true);
            setShowGrid(false);
            setError(`Authorisation header (Bearer token) not found`);
          }
        })
        .finally(() => {
          setShowGrid(true);
        });
    } else {
      setShowGrid(false);
      setUnauthorisedError(true);
      setError(`Authorisation header (Bearer token) not found`);
    }
  }, [year, showGrid]);

  return (
    <div className="factors-container">
      {showGrid && (
        <>
          <div className="factors-title">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              World Happiness Factors
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
          </div>
        </>
      )}

      {showGrid && (
        <>
          <div className="grid-holder">
            <div className="ag-theme-alpine">
              <AgGridReact
                columnDefs={columns}
                onGridReady={onGridReady}
                defaultColDef={{ resizable: true, flex: 3 }}
                rowData={rowData}
                className="factors-grid"
                onFirstDataRendered={onFirstDataRendered}
                pagination={true}
                paginationPageSize={10}
              />
            </div>
          </div>
          <div className="chart-container">
            <FactorChart
              data={rowData}
              chartTitle="Economic Factor"
              xData={rowData.slice(0, 10).map((item) => {
                return item.country;
              })}
              yData={rowData.slice(0, 10).map((item) => {
                return item.economy;
              })}
            />
            <FactorChart
              data={rowData}
              chartTitle="Family Factor"
              xData={rowData.slice(0, 10).map((item) => {
                return item.country;
              })}
              yData={rowData.slice(0, 10).map((item) => {
                return item.family;
              })}
            />
            <FactorChart
              data={rowData}
              chartTitle="Health Factor"
              xData={rowData.slice(0, 10).map((item) => {
                return item.country;
              })}
              yData={rowData.slice(0, 10).map((item) => {
                return item.health;
              })}
            />
            <FactorChart
              data={rowData}
              chartTitle="Freedom Factor"
              xData={rowData.slice(0, 10).map((item) => {
                return item.country;
              })}
              yData={rowData.slice(0, 10).map((item) => {
                return item.freedom;
              })}
            />
            <FactorChart
              data={rowData}
              chartTitle="Generosity Factor"
              xData={rowData.slice(0, 10).map((item) => {
                return item.country;
              })}
              yData={rowData.slice(0, 10).map((item) => {
                return item.freedom;
              })}
            />
            <FactorChart
              data={rowData}
              chartTitle="Trust Factor"
              xData={rowData.slice(0, 10).map((item) => {
                return item.country;
              })}
              yData={rowData.slice(0, 10).map((item) => {
                return item.freedom;
              })}
            />
          </div>
        </>
      )}
      {!showGrid && (
        <div className="no-data-container">
          {unauthorisedError ? (
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
                The content of this page is only visible for when you are signed
                in.
              </Typography>
              <Typography
                component="h3"
                variant="h4"
                align="center"
                color="textPrimary"
                gutterBottom
                padding-top="2px"
              >
                Please sign in to view the content of this page
              </Typography>
            </div>
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
                It seems like the year format was incorrect
              </Typography>
              <Typography
                component="h3"
                variant="h4"
                align="center"
                color="textPrimary"
                gutterBottom
                padding-top="2px"
              >
                Please make sure the year format is yyyy
              </Typography>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Factors;
