import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import PropTypes from "prop-types";
import AccountsUIWrapper from "./AccountsUIWrapper.js";
import { withTracker } from "meteor/react-meteor-data";
import { Tracker } from "meteor/tracker";
import { Meteor } from "meteor/meteor";
import { Notificaciones } from "../api/notificaciones.js";
import { Chats } from "../api/notificaciones.js";
import { Jumbotron,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink } from "reactstrap";
import Home from "./home.js";

class App extends Component {
  constructor (props) {
    super(props);
  }
  getMensages (chatId) {
    Tracker.autorun(() => {
      Meteor.subscribe("notificaciones");
      this.setState({
        mensajes: Notificaciones.find({ chatId: chatId }).fetch()
      });
    });
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
  Meteor.subscribe("notificaciones");
  Meteor.subscribe("chats");
  return {
    currentUser: Meteor.user(),
    notificaciones: Notificaciones.find({}).fetch(),
    chats: Chats.find({}).fetch()
  };
})(App);
