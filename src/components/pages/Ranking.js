import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Badge } from "reactstrap";
import "./Ranking.css";

const Ranking = () => {
  const [numCountries, setNumCountries] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const columns = [
    { headerName: "Rank", field: "rank", sortable: true, filter: true },
    { headerName: "Country", field: "country", sortable: true, filter: true },
    { headerName: "Score", field: "score", sortable: true, filter: true },
    { headerName: "Year", field: "year", sortable: true, filter: true },
  ];

  function onGridReady(params) {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    setNumCountries(params.api.getDisplayedRowCount());
    // console.log("Number of row counts: " + params.api.getDisplayedRowCount());
  }

  const onFilterTextChange = (e) => {
    gridApi.setQuickFilter(e.target.value);
    setNumCountries(gridApi.getDisplayedRowCount());
  };

  //   const getNumCountries = () => {
  //     setNumCountries(setNumCountries(gridOptions.api.getDisplayedRowCount()));
  //   };

  const getCountries = () => {};

  useEffect(() => {
    fetch("http://131.181.190.87:3000/rankings")
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
      .then((rankings) => setRowData(rankings));
  }, []);

  return (
    <div className="ranking-container">
      <div className="ranking-title">
        <h1>Happiness ranking by country </h1>

        <div className="searchDiv">
          <input
            className="searchBox"
            type="search"
            placeholder=" search something..."
            onChange={onFilterTextChange}
          />
        </div>
      </div>
      <div className="ag-theme-alpine">
        <AgGridReact
          columnDefs={columns}
          onGridReady={onGridReady}
          defaultColDef={{ flex: 1 }}
          rowData={rowData}
          className="ranking-grid"
          pagination={true}
          paginationPageSize={10}
        />
        <p>
          There is <Badge color="success"> {numCountries}</Badge> rows
        </p>
      </div>
    </div>
  );
};

export default Ranking;
