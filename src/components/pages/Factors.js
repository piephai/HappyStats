import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Badge } from "reactstrap";
import "./Factors.css";
import DropdownMenu from "../Dropdown";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

const Factors = () => {
  const { user, setUser } = useContext(UserContext);
  const [numCountries, setNumCountries] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [year, setYear] = useState("2020");
  const [showGrid, setShowGrid] = useState(false);

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

  const checkGridHasData = () => {
    if (rowData.length > 0) {
      setShowGrid(true);
    } else {
      setShowGrid(false);
    }
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
    checkGridHasData();
  }, [rowData]);

  useEffect(() => {
    if (user) {
      fetch(`http://131.181.190.87:3000/factors/${year}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `${user.token_type} ${user.token}`,
        },
      })
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
        .then((factors) => setRowData(factors));
    }
  }, [year]);

  return (
    <div className="factors-container">
      {showGrid && (
        <div className="factors-title">
          <h1>Country Happiness Factors by Year </h1>
          <div className="searchDiv">
            <input
              className="searchBox"
              type="search"
              placeholder=" search something..."
              onChange={onFilterTextChange}
            />
            <DropdownMenu
              title={years[0]}
              items={years}
              onSelection={setYear}
            />
          </div>
        </div>
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
          <div className="no-data-content">
            <h1>Oops!</h1>
            <h3>
              The content of this page is only visible for when you are logged
              in.
            </h3>
            <h3>Please click the button below to log in</h3>
            <Link to="/sign-in" className="sign-in-btn">
              <Button variant="outline-primary">Sign In</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Factors;
