import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Button,
  Form,
  Label,
  Input } from "reactstrap";
import Chat from "./chat.js";
import Publicacion from "./publicacion.js";

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
          chatSeleccionado={this.props.chatSeleccionado} enviarMensaje= {this.props.enviarMensaje}
          mensajes= {this.props.notificaciones}/>
      );
    }
    return chats;
  }
  darPublicaciones () {
    let publicaciones = "";
    if (this.props.chatSeleccionado === null &&
    typeof this.props.chats !== "undefined") {
      publicaciones = this.props.chats.map((n, i) => {
        return (
          <ListGroup>
            <ListGroupItem onClick={() => this.props.seleccionarChat(n)} tag="button" key={i} action>
              {n.username1 === this.props.usuario.username ? n.username2 : n.username1}
            </ListGroupItem>
          </ListGroup>
        );
      });
    } else {
      publicaciones = (
        <Chat salirChat={this.props.desSeleccionarChat} usuario={this.props.usuario}
          chatSeleccionado={this.props.chatSeleccionado} enviarMensaje= {this.props.enviarMensaje}
          mensajes= {this.props.notificaciones}/>
      );
    }
    return publicaciones;
  }

  render () {
    return (
      <Row>
        <Col sm="3">
          <h2>Tus Mensajes</h2>
          <Form className="new-task" onSubmit={this.props.createChat} >
            <Label for="idUser2">Temporal, colocar id usuario a contactar</Label>
            <Input
              id="idUser2"
              type="text"
              ref="idUser2"
              placeholder="usuario 2 id"
            />
            <Button>Crear hilo chat</Button>
          </Form>
          {this.darChats()}
        </Col>
        <Col sm="6">
          <h2>Tus Publicaciones</h2>
          <ListGroup>
            {this.darPublicaciones()}
          </ListGroup>
        </Col>
        <Col sm="3">
          <p>hola</p>
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
  createChat: PropTypes.func,
  desSeleccionarChat: PropTypes.func,
  chatSeleccionado: PropTypes.object,
  //Publicaciones
  seleccionarPublicacion: PropTypes.func,
  publicacionSeleccionada: PropTypes.object,
  salirPublicacion: PropTypes.func,
  publicaciones: PropTypes.array
};
