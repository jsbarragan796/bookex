import React, { Component } from "react";
import Home from "./home.js";
import PropTypes from "prop-types";
import AccountsUIWrapper from "./AccountsUIWrapper.js";
import { Notificaciones } from "../api/notificaciones.js";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import "bootstrap/dist/css/bootstrap.css";
import { Jumbotron,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink } from "reactstrap";


class App extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    const usuario = this.props.currentUser ? ", " + this.props.currentUser.username : " a Bookex";
    const cuerpo = this.props.currentUser ? (
      <Home usuario={this.props.currentUser} />
    ) : " ";
    return (
      <div>
        <Navbar color="faded" light expand="md">
          <Nav navbar>
            <NavbarBrand >Bookex</NavbarBrand>
            <NavItem>
              <NavLink>
                <AccountsUIWrapper />
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink >Stats</NavLink>
            </NavItem>
            <NavItem>
              <NavLink >Home</NavLink>
            </NavItem>
          </Nav>
          <Nav className="ml-auto" navbar />
        </Navbar>
        <Jumbotron>
          <h1> Bienvenido{usuario}</h1>
        </Jumbotron>
        {cuerpo}
      </div>
    );
  }
}
App.propTypes = {
  currentUser: PropTypes.object
};


export default withTracker(() => {
  return {
    currentUser: Meteor.user()
  };
})(App);
