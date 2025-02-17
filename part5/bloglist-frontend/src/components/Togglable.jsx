import { useState } from "react";

const Togglable = (props) => {
  const hideWhenVisible = { display: props.visibility ? "none" : "" };
  const showWhenVisible = { display: props.visibility ? "" : "none" };

  const toggleVisibility = () => {
    props.setVisibility(!props.visibility);
  };

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  );
};

export default Togglable;
