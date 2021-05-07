import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Badge } from "reactstrap";
import Typography from "@material-ui/core/Typography";
import "./Factors.css";
import DropdownMenu from "../Dropdown";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";

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
    { headerName: "Rank", field: "rank", sortable: true, filter: true },
    { headerName: "Country", field: "country", sortable: true, filter: true },
    { headerName: "Score", field: "score", sortable: true, filter: true },
    { headerName: "Economy", field: "economy", sortable: true, filter: true },
    { headerName: "Family", field: "family", sortable: true, filter: true },
    { headerName: "Health", field: "health", sortable: true, filter: true },
    { headerName: "Freedom", field: "freedom", sortable: true, filter: true },
    {
      headerName: "Generosity",
      field: "generosity",
      sortable: true,
      filter: true,
    },
    { headerName: "Trust", field: "trust", sortable: true, filter: true },
  ];

  const handleErrors = (response) => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response;
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    setNumCountries(params.api.getDisplayedRowCount());
  };

  const onFilterTextChange = (e) => {
    gridApi.setQuickFilter(e.target.value);
    setNumCountries(gridApi.getDisplayedRowCount());
  };

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
              label="Search something..."
              variant="outlined"
              onChange={onFilterTextChange}
              size="small"
            />
            <DropdownMenu
              className="year-dropdown"
              title={years[0]}
              items={years}
              onSelection={setYear}
            />
          </div>
        </>
      )}

      {showGrid && (
        <div className="ag-theme-alpine">
          <AgGridReact
            columnDefs={columns}
            onGridReady={onGridReady}
            defaultColDef={{ flex: 3 }}
            rowData={rowData}
            className="factors-grid"
          />
          <p>
            There is <Badge color="success"> {numCountries}</Badge> rows
          </p>
        </div>
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
