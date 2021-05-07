import React, { useState, useEffect } from "react";
// import { ToggleButton } from "react-bootstrap";
// import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import "./Dropdown.css";

const DropdownMenu = (props) => {
  const [items, setItems] = useState(props.items);
  const [selection, setSelection] = useState(props.selection);

  //Use effect should only happen when selection changes
  useEffect(() => {
    setItems(props.items);
    props.onSelection(selection);
  }, [selection, props.items]);

  return (
    <div>
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {props.menuTitle} - {props.selection}
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown-menu">
          {items.map((item) => (
            <Dropdown.Item onClick={() => setSelection(item)}>
              {item}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default DropdownMenu;
