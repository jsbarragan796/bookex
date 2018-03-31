import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.css";
import AccountsUIWrapper from "./AccountsUIWrapper.js";
import { Notificaciones } from "../api/notificaciones.js";
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
  handleSubmit (event) {
    event.preventDefault();

    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    Meteor.call("noti.insert", text);
    ReactDOM.findDOMNode(this.refs.textInput).value = "";
  }

  render () {
    const usuario = this.props.currentUser ? ", " + this.props.currentUser.username : " a Bookex";
    const noti = this.props.notificaciones.map((n, i) => {
      return (
        <div key={i}>
          {n.text}
        </div>
      );
    });
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
        { this.props.currentUser ?
          <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
            <input
              type="text"
              ref="textInput"
              placeholder="Type to add new tasks"
            />
          </form> : ""
        }
        {noti}
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
