import React, { useState, useEffect } from "react";
// import { ToggleButton } from "react-bootstrap";
// import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

const DropdownMenu = (props) => {
  const [items, setItems] = useState(props.items);
  const [selection, setSelection] = useState(props.title);

  //Use effect should only happen when selection changes
  useEffect(() => {
    props.onSelection(selection);
  }, [selection]);

  return (
    <div>
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {selection}
        </Dropdown.Toggle>
        <Dropdown.Menu>
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
