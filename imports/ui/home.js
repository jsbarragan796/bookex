import React, { Component } from "react";
import PropTypes from "prop-types";
import Chat from "./chat.js";
import Publicacion from "./publicacion.js";
import ListaPublicaciones from "./listaPublicaciones.js";
import {
  ListGroupItem,
  Row,
  Col,
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";


export default class Home extends Component {
  constructor (props) {
    super(props);
    this.state = {
      visibleModal: false,
      mensaje: "",
      publicacionExSel: null
    };
    this.onDismiss = this.onDismiss.bind(this);
    this.onMostrar = this.onMostrar.bind(this);
    this.darCalificacion = this.darCalificacion.bind(this);
    this.publicacionExSelecionada = this.publicacionExSelecionada.bind(this);
    this.quitarPublicacion = this.quitarPublicacion.bind(this);
  }
  onMostrar (msg) {
    this.setState({
      mensaje: msg.mensaje,
      visibleModal: true });
  }

  onDismiss () {
    this.setState({ visibleModal: false });
  }

  publicacionExSelecionada (publicacion) {
    this.setState({
      publicacionExSel: publicacion,
      mensaje: "Ya puedes agregar otra entrada de " +
      publicacion.titulo + ", ve a la seccion de tus publicaciones y termina de completar el formulario",
      visibleModal: true
    });
  }
  quitarPublicacion () {
    this.setState({
      publicacionExSel: null
    });
  }
  darCalificacion (id) {
    if (this.props.calificaciones.length > 0) {
      function buscar (calificacion) {
        return (calificacion.idUser === id);
      }
      let calificacion = this.props.calificaciones.find(buscar);
      if (calificacion !== null && typeof calificacion !== "undefined") {
        return this.getNota(calificacion.nota);
      } else {
        return this.getNota(0);
      }
    } else {
      return this.getNota(0);
    }
  }

  darChats () {
    let chats = "";
    if (this.props.chatSeleccionado === null &&
    typeof this.props.chats !== "undefined") {
      chats = this.props.chats.map((n, i) => {
        return (
          <ListGroupItem onClick={() => this.props.seleccionarChat(n)} tag="button" key={i} action>
            {n.username1 === this.props.usuario.username ? n.username2 : n.username1}
            {" - "}
            {n.username1 === this.props.usuario.username ?
              this.darCalificacion(n.ownerId2) : this.darCalificacion(n.ownerId1) }
          </ListGroupItem>
        );
      });
    } else {
      let n = this.props.chatSeleccionado;
      chats = (
        <Chat salirChat={this.props.desSeleccionarChat} usuario={this.props.usuario}
          chatSeleccionado={this.props.chatSeleccionado}
          mensajes= {this.props.notificaciones} calificaciones={this.props.calificaciones}
          calificacion={n.username1 === this.props.usuario.username ?
            this.darCalificacion(n.ownerId2) : this.darCalificacion(n.ownerId1)}/>
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
        publicacionExistente={this.state.publicacionExSel}
        quitarPublicacion ={this.quitarPublicacion}
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
        alert={this.onMostrar}
        publicacionExSelecionada={this.publicacionExSelecionada}
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
      <div>
        <Modal isOpen={this.state.visibleModal} toggle={this.onDismiss} className="Notificacion">
          <ModalHeader toggle={this.toggle}>Notificación</ModalHeader>
          <ModalBody>
            {this.state.mensaje}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.onDismiss}>Aceptar</Button>
          </ModalFooter>
        </Modal>
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
      </div>
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
  publicaciones: PropTypes.array,
  calificaciones: PropTypes.array
};
