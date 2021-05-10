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
  const [rowData, setRowData] = useState([]);
  const [error, setError] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [year, setYear] = useState("2020");
  const [showGrid, setShowGrid] = useState(false);
  const [unauthorisedError, setUnauthorisedError] = useState(false);
  const [resolution, setResolution] = useState(null);
  const [colourIntensity, setColourIntensity] = useState("0.7");

  const years = ["2020", "2019", "2018", "2017", "2016", "2015"];
  const colourIntensities = [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8];

  const columns = [
    {
      headerName: "Rank",
      field: "rank",
      sortable: true,
      filter: true,
      minWidth: 70,
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
    onFirstDataRendered();
  };

  //Update the grid api filter
  const onFilterTextChange = (e) => {
    gridApi.setQuickFilter(e.target.value);
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
        //Catch the error that was thrown by the handle error function
        .catch((err) => {
          if (err.message === "400") {
            setShowGrid(false);
            setError(`Invalid year format`);
            setResolution(`Please check your format is yyyy`);
          }
          if (err.message === "401") {
            setUnauthorisedError(true);
            setShowGrid(false);
            setError(
              `The content of this page is only visible for when you are signed in`
            );
            setResolution(`Please sign in to view the content of this page`);
          } else {
            setUnauthorisedError(true);
            setShowGrid(false);
            setError(`It seems like you may not be connected to the internet`);
            setResolution(`Please check your connection and try again`);
          }
        })
        .finally(() => {
          //Show the grid if the promise is fulfilled
          setShowGrid(true);
        });
    } else {
      setShowGrid(false);
      setUnauthorisedError(true);
      setError(
        `The content of this page is only visible for when you are signed in`
      );
      setResolution(`Please sign in to view the content of this page`);
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
            <DropdownMenu
              className="colour-intensity"
              selection={colourIntensity}
              items={colourIntensities}
              onSelection={setColourIntensity}
              menuTitle="Chart Transparency"
            />
          </div>
        </>
      )}
      {/* Only show the grid if the user is logged in and there is no error */}
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
              />
            </div>
          </div>
          <div className="chart-container">
            {/* Pass in data for each Factor chart. Only pass in the top 10 rows which are sorted by its score  */}
            <FactorChart
              data={rowData}
              chartTitle="Economic Factor"
              xData={rowData.slice(0, 10).map((item) => {
                return item.country;
              })}
              yData={rowData.slice(0, 10).map((item) => {
                return item.economy;
              })}
              colourIntensity={colourIntensity}
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
              colourIntensity={colourIntensity}
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
              colourIntensity={colourIntensity}
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
              colourIntensity={colourIntensity}
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
              colourIntensity={colourIntensity}
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
              colourIntensity={colourIntensity}
            />
          </div>
        </>
      )}
      {/* If there is an error displaying the grid or if the user is not logged in then display an error screen */}
      {!showGrid && (
        <div className="no-data-container">
          {/* Check if it the error was an authorisation error if it is then appripriately display an authorisation error page*/}
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
                {error}
              </Typography>
              <Typography
                component="h3"
                variant="h4"
                align="center"
                color="textPrimary"
                gutterBottom
                padding-top="2px"
              >
                {resolution}
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
