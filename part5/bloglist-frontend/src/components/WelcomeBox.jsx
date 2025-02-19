import { useState, forwardRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";

const WelcomeBox = forwardRef((props, refs) => {
  const [userName, setUserName] = useState(props.user.name);
  WelcomeBox.displayName = props.buttonLabel;

  const setPersonalNickname = () => {
    setUserName("UWUrevenger");
  };
  useImperativeHandle(refs, () => {
    return { setPersonalNickname };
  });
  return (
    <p>
      hello {userName} welcome back!{" "}
      <button onClick={props.handleLogout}>logout</button>
    </p>
  );
});

WelcomeBox.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

export default WelcomeBox;
