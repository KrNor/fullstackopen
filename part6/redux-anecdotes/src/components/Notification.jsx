import { useSelector } from "react-redux";
const Notification = () => {
  const notification = useSelector((state) => {
    return state.notification;
  });
  const style = {
    visibility: notification.length < 1 ? "hidden" : "visible",
    border: "solid",
    padding: notification.length < 1 ? 0 : 10,
    borderWidth: 1,
  };
  return <div style={style}>{notification} </div>;
};

export default Notification;
