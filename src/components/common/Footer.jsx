import React from "react";
import { COPYRIGHT_TEXT } from "../../containers/Landing/config";

class Footer extends React.Component {
  render() {
    const classes = this.props.class ? this.props.class : "";
    return (
      <footer
        style={{ backgroundColor: "transparent" }}
        id={"footer"}
        className={
          "text-xxs w-full font-medium flex items-center justify-center text-center text-light-grey-blue min-h-13 px-3 py-4 " +
          classes
        }
      >
        { COPYRIGHT_TEXT() }
      </footer>
    );
  }
}

export default Footer;
