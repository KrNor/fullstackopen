import { useState, forwardRef } from "react";
import PropTypes from "prop-types";

const WelcomeBox = forwardRef((props, refs) => {
  const [userName, setUserName] = useState(props.user.name);
  WelcomeBox.displayName = props.buttonLabel;

  // const setPersonalNickname = () => {
  //   setUserName("CollestNickname");
  // };
  // useImperativeHandle(refs, () => {
  //   return { setPersonalNickname };
  // });
  return (
    <>
      hello {userName} welcome back!{" "}
      <button onClick={props.handleLogout}>logout</button>
    </>
  );
});

WelcomeBox.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

export default WelcomeBox;
