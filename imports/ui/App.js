import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import AccountsUIWrapper from "./AccountsUIWrapper.js";
import { Notificaciones } from "../api/notificaciones.js";
import Home from "./home.js";
import { Jumbotron,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink } from "reactstrap";

class App extends Component {
  constructor (props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit (event) {
    event.preventDefault();

    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    Meteor.call("noti.insert", text);
    ReactDOM.findDOMNode(this.refs.textInput).value = "";
  }

  render () {
    const usuario = this.props.currentUser ? ", " + this.props.currentUser.username : " a Bookex";
    const cuerpo = this.props.currentUser ? (
      <Home handle={this.handleSubmit} usuario={this.props.currentUser} noti= {this.props.notificaciones}/>
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


export default withTracker(() => {
  Meteor.subscribe("notificaciones");
  return {
    currentUser: Meteor.user(),
    notificaciones: Notificaciones.find({}).fetch()
  };
})(App);
