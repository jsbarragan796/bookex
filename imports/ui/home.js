import React, { Component } from "react";
import PropTypes from "prop-types";
import Chat from "./chat.js";
import Publicacion from "./publicacion.js";
import ListaPublicaciones from "./listaPublicaciones.js";
import {
  ListGroupItem,
  Row,
  Col
} from "reactstrap";


export default class Home extends Component {
  constructor (props) {
    super(props);
  }

  darChats () {
    let chats = "";
    if (this.props.chatSeleccionado === null &&
    typeof this.props.chats !== "undefined") {
      chats = this.props.chats.map((n, i) => {
        return (
          <ListGroupItem onClick={() => this.props.seleccionarChat(n)} tag="button" key={i} action>
            {n.username1 === this.props.usuario.username ? n.username2 : n.username1}
          </ListGroupItem>
        );
      });
    } else {
      chats = (
        <Chat salirChat={this.props.desSeleccionarChat} usuario={this.props.usuario}
          chatSeleccionado={this.props.chatSeleccionado}
          mensajes= {this.props.notificaciones}/>
      );
    }
    return chats;
  }

  darPublicaciones () {
    let publicaciones = "";
    publicaciones = (
      <Publicacion
        publicaciones={this.props.publicaciones}
        usuario={this.props.usuario}
        getNota={this.getNota}
      />
    );
    return publicaciones;
  }

  renderListaPub () {
    let lista = "";
    lista = (
      <ListaPublicaciones
        publicaciones={this.props.publicaciones}
        usuario={this.props.usuario}
        getNota={this.getNota}
      />
    );
    return lista;
  }

  getNota (nota) {
    let resp = "";
    if (nota === 0) {
      resp = "Aun no hay puntuaciones 😢.";
    } else {
      for (var i = 0; i < nota; i++) {
        resp = resp + "⭐";
      }
    }
    return resp;
  }

  render () {
    return (
      <Row>
        <Col sm="3">
          <h2>Tus Mensajes</h2>
          <hr/>
          {this.darChats()}
        </Col>
        <Col sm="9">
          {this.darPublicaciones()}
          {this.renderListaPub()}
        </Col>
      </Row>
    );
  }
}

//Props del Home
Home.propTypes = {
  //general
  usuario: PropTypes.object,
  // chats
  notificaciones: PropTypes.array,
  mensajes: PropTypes.array,
  chats: PropTypes.array,
  salirChat: PropTypes.func,
  seleccionarChat: PropTypes.func,
  desSeleccionarChat: PropTypes.func,
  chatSeleccionado: PropTypes.object,
  //Publicaciones
  publicaciones: PropTypes.array
};
