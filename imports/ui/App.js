import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import PropTypes from "prop-types";
import AccountsUIWrapper from "./AccountsUIWrapper.js";
import Home from "./home.js";
import Stats from "./stats.js";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Notificaciones } from "../api/notificaciones.js";
import { Chats } from "../api/notificaciones.js";
import { Publicaciones } from "../api/publicaciones.js";
import { Calificaciones } from "../api/notificaciones.js";
import "../../public/style.css";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  NavbarToggler,
  Collapse } from "reactstrap";


class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      chatSeleccionado: null,
      mensajes: [],
      enHome: true,
      isOpen: false
    };
    this.seleccionarChat = this.seleccionarChat.bind(this);
    this.desSeleccionarChat = this.desSeleccionarChat.bind(this);
    this.cambioStats = this.cambioStats.bind(this);
    this.cambioHome = this.cambioHome.bind(this);
    this.toggle = this.toggle.bind(this);
  }
  toggle () {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  seleccionarChat (chat) {
    this.setState({
      chatSeleccionado: chat,
      mensajes: Notificaciones.find({ chatId: chat._id }).fetch()
    });
  }
  desSeleccionarChat () {
    this.setState({
      chatSeleccionado: null,
      mensajes: []
    });
  }
  cambioStats () {
    this.setState({
      enHome: false
    });
  }
  cambioHome () {
    this.setState({
      enHome: true
    });
  }

  renderNav (usuario) {
    //active
    let home = "";
    let stats = "";
    if (this.props.usuario) {
      if (this.state.enHome) {
        home = (
          <NavItem>
            <NavLink onClick = {this.cambioHome} active>Tu menú</NavLink>
          </NavItem>
        );
        stats = (
          <NavItem>
            <NavLink onClick = {this.cambioStats} > Inicio</NavLink>
          </NavItem>
        );
      } else {
        home = (
          <NavItem>
            <NavLink onClick = {this.cambioHome} >Tu menú</NavLink>
          </NavItem>
        );
        stats = (
          <NavItem>
            <NavLink onClick = {this.cambioStats} active> Inicio</NavLink>
          </NavItem>
        );
      }
    } else {
      stats = (
        <NavItem>
          <NavLink active> Inicio</NavLink>
        </NavItem>
      );
    }
    return (
      <Navbar color="faded" light expand="md">
        <NavbarBrand role="listitem">
          <img src="/navbarBookex2.png" height="50" alt="Logo Bookex"/>
        </NavbarBrand>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav className="ml-auto" navbar>
            {stats}
            {home}
            <NavItem>
              <NavLink >
                {usuario}
                <AccountsUIWrapper />
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>);
  }


  render () {
    const usuario = this.props.usuario ? "Hola, " : "Realiza ";
    const cuerpo = this.state.enHome && this.props.usuario ? (
      <Home salirChat={this.desSeleccionarChat} usuario={this.props.usuario}
        chatSeleccionado={this.state.chatSeleccionado}
        mensajes= {this.props.notificaciones} notificaciones={this.props.notificaciones}
        chats = {this.props.chats} seleccionarChat={this.seleccionarChat}
        desSeleccionarChat={this.desSeleccionarChat}
        publicaciones={this.props.publicaciones} calificaciones={this.props.calificaciones}/>
    ) : <Stats publicaciones={this.props.publicaciones} calificaciones={this.props.calificaciones}/>;
    return (
      <div>
        {this.renderNav(usuario)}
        <div className="tumenu">
          {cuerpo}
        </div>
      </div>
    );
  }
}


//prop types for App
App.propTypes = {
  usuario: PropTypes.object,
  chats: PropTypes.array,
  notificaciones: PropTypes.array,
  publicaciones: PropTypes.array,
  calificaciones: PropTypes.array
};

export default withTracker(() => {
  Meteor.subscribe("notificaciones");
  Meteor.subscribe("chats");
  Meteor.subscribe("publicaciones");
  Meteor.subscribe("calificaciones");
  let user = Meteor.user();
  if ((user !== null && typeof user !== "undefined") &&
  (user.profile !== null && typeof user.profile !== "undefined")) {
    user.username = user.profile.name;
  }
  return {
    usuario: user,
    notificaciones: Notificaciones.find({}).fetch(),
    chats: Chats.find({}).fetch(),
    publicaciones: Publicaciones.find({}).fetch(),
    calificaciones: Calificaciones.find({}).fetch()
  };
})(App);
