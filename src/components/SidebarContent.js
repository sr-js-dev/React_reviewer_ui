import React from 'react';
import PropTypes from 'prop-types';
import {
  Navbar,
  NavbarBrand } from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faList from '@fortawesome/fontawesome-free-solid/faList';
import faCalendar from '@fortawesome/fontawesome-free-solid/faCalendarAlt';
import faHome from '@fortawesome/fontawesome-free-solid/faHome';
import faEnvelope from '@fortawesome/fontawesome-free-solid/faEnvelope';
import faPercent from '@fortawesome/fontawesome-free-solid/faPercent';
import { Link } from 'react-router-dom';

const styles = {
  sidebar: {
    width: 320,
    height: '100%',
    backgroundColor: '#EFEFEF',
  },
  sidebarLink: {
    display: 'block',
    padding: '16px 0px',
    color: '#565656',
    textDecoration: 'none',
  },
  divider: {
    margin: '8px 0',
    height: 1,
    backgroundColor: '#565656',
  },
  content: {
    padding: '16px',
    height: '100%',
    marginTop: '30px',
    backgroundColor: '#EFEFEF',
  },
};

class SidebarContent extends React.Component {
  // constructor(props) {
  //   super(props);
  // }
  // if(!props.user) return null;

  // const links = [];

  // for (let ind = 0; ind < 10; ind++) {
  //   links.push(
  //     <a key={ind} href="#" style={styles.sidebarLink}>Mock menu item {ind}</a>);
  // }

  render() {
    return (
      <div>
        {this.props.layout === 'application' && (
          <div>
            <header>
              <Navbar className="bg-vpa bg-vpa-sidebar">
                <NavbarBrand href="/">VP Insight</NavbarBrand>
              </Navbar>
            </header>
            <div style={styles.content}>
              <Link to="/" style={styles.sidebarLink}><FontAwesomeIcon icon={faList} /> Reservations</Link>
              <Link to="/calendar" style={styles.sidebarLink}><FontAwesomeIcon icon={faCalendar} /> Calendar</Link>
              <Link to="/properties" style={styles.sidebarLink}><FontAwesomeIcon icon={faHome} /> Properties</Link>
              <Link to="/emails" style={styles.sidebarLink}><FontAwesomeIcon icon={faEnvelope} /> Email Templates</Link>
              <Link to="/tax" style={styles.sidebarLink}><FontAwesomeIcon icon={faPercent} /> Tax</Link>
              <div style={styles.divider} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

SidebarContent.propTypes = {
  style: PropTypes.object,
};

export default SidebarContent;
