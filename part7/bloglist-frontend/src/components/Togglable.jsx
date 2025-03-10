import { Button } from "react-bootstrap";

const Togglable = (props) => {
  const hideWhenVisible = { display: props.visibility ? "none" : "" };
  const showWhenVisible = { display: props.visibility ? "" : "none" };

  const toggleVisibility = () => {
    props.setVisibility(!props.visibility);
  };

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button onClick={toggleVisibility}>{props.buttonLabel}</Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button onClick={toggleVisibility}>cancel</Button>
      </div>
    </div>
  );
};

export default Togglable;
