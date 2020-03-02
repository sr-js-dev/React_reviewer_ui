import React, { Component } from 'react';
import {
  Badge,
  Navbar,
  Nav,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faBars from '@fortawesome/fontawesome-free-solid/faBars';
import faChevronLeft from '@fortawesome/fontawesome-free-solid/faChevronLeft';
import faUserCircle from '@fortawesome/fontawesome-free-solid/faUserCircle';
import faBell from '@fortawesome/fontawesome-free-solid/faBell';
import UserService from '../services/UserService';
import faCog from '@fortawesome/fontawesome-free-solid/faCog';
import faSignOut from '@fortawesome/fontawesome-free-solid/faSignOutAlt';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      addProperty: false,
    };

    this.logout = this.logout.bind(this);
    this.settings = this.settings.bind(this);
    this.toggle = this.toggle.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.switchProperty = this.switchProperty.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  switchProperty(id) {
    UserService.switchProperty(id)
      .then(usr => {
        this.props.getUser();
      })
      .catch(error => {
        console.log('error');
        console.log(error);
      });
  }

  closeModal() {
    this.setState({ addProperty: false });
    this.props.getUser();
  }

  logout() {
    localStorage.removeItem('access_token');
    this.props.callback();
    this.props.history.push('/dashboard');
  }

  settings() {
    this.props.history.push('/settings');
  }

  notifications() {
    this.props.history.push('/notifications');
  }

  render() {
    if (!this.props.user) return null;

    return (
      <header>
        <Navbar className="bg-vpa" expand="md">
          {!this.props.docked && (
            <Nav className="" navbar>
              <a onClick={this.props.toggleDock} className="pr-3">
                <FontAwesomeIcon icon={faBars} />
              </a>
            </Nav>
          )}
          {this.props.docked && (
            <Nav className="" navbar>
              <a onClick={this.props.toggleDock} className="pr-3">
                <FontAwesomeIcon icon={faChevronLeft} />
              </a>
            </Nav>
          )}
          <Nav className="property-selector" navbar>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                {this.props.user && this.props.user.current_property
                  ? this.props.user.current_property.name
                  : ''}
              </DropdownToggle>
              <DropdownMenu>
                {this.props.user
                  ? this.props.user.props.map((e, i) => {
                      return (
                        <DropdownItem key={e.id}>
                          <a
                            onClick={() => {
                              this.switchProperty(e.id);
                            }}
                          >
                            {e.name}
                          </a>
                        </DropdownItem>
                      );
                    })
                  : null}
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
          <Nav className="ml-auto" navbar>
            <NavLink className="pr-2" onClick={() => this.notifications()}>
              <FontAwesomeIcon icon={faBell} />
              {this.props.user &&
              this.props.user.user_notifications &&
              this.props.user.user_notifications.filter(function(item) {
                return !item.viewed;
              }).length > 0 ? (
                <Badge color="danger" className="pl-1">
                  {this.props.user.user_notifications.length}
                </Badge>
              ) : (
                ''
              )}
            </NavLink>
          </Nav>
          <Nav className="" navbar>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
                {this.props.user && this.props.user.current_property ? (
                  <FontAwesomeIcon icon={faUserCircle} />
                ) : (
                  ''
                )}
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>
                  <NavLink onClick={() => this.settings()}>
                    <FontAwesomeIcon icon={faCog} /> Account Settings
                  </NavLink>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem>
                  <NavLink onClick={() => this.logout()}>
                    <FontAwesomeIcon icon={faSignOut} /> Logout
                  </NavLink>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Navbar>
      </header>
    );
  }
}

export default Header;
