import React, { Component } from "react";
import PropTypes from "prop-types";
import Chat from "./chat.js";
import Publicacion from "./publicacion.js";
import ListaPublicaciones from "./listaPublicaciones.js";
import classnames from "classnames";
import {
  ListGroupItem,
  Row,
  Col,
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Nav,
  NavLink,
  NavItem,
  TabContent,
  TabPane
} from "reactstrap";


export default class Home extends Component {
  constructor (props) {
    super(props);
    this.state = {
      visibleModal: true,
      mensaje: "Bookex está recolectando imformacion de lo que haces con Hotjar." +
      " Al usar la aplicación aceptas la captura de tu interacción con la aplicación",
      publicacionExSel: null,
      activeTab: "1"
    };
    this.onDismiss = this.onDismiss.bind(this);
    this.onMostrar = this.onMostrar.bind(this);
    this.darCalificacion = this.darCalificacion.bind(this);
    this.publicacionExSelecionada = this.publicacionExSelecionada.bind(this);
    this.quitarPublicacion = this.quitarPublicacion.bind(this);
    this.toggle = this.toggle.bind(this);
  }
  toggle (tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
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
    this.toggle("2");
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
    let chats = "No tienes chats 😢";
    if (this.props.chats.length > 0) {
      chats = this.props.chats.map((n, i) => {
        return (
          <Col sm="4" key={i}>
            <ListGroupItem onClick={() => this.props.seleccionarChat(n)} tag="button" key={i} action>
              {n.username1 === this.props.usuario.username ? n.username2 : n.username1}
              {" - "}
              {n.username1 === this.props.usuario.username ?
                this.darCalificacion(n.ownerId2) : this.darCalificacion(n.ownerId1) }
            </ListGroupItem>
          </Col>
        );
      });
    }
    if (this.props.chatSeleccionado !== null &&
    typeof this.props.chats !== "undefined") {
      let n = this.props.chatSeleccionado;
      chats = (
        <Row>
          {chats}
          <Col sm="8">
            <Chat salirChat={this.props.desSeleccionarChat} usuario={this.props.usuario}
              chatSeleccionado={this.props.chatSeleccionado}
              mensajes= {this.props.notificaciones} calificaciones={this.props.calificaciones}
              calificacion={n.username1 === this.props.usuario.username ?
                this.darCalificacion(n.ownerId2) : this.darCalificacion(n.ownerId1)}
              nombreChat={n.username1 === this.props.usuario.username ? n.username2 : n.username1}/>
          </Col>
        </Row>);
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
          <ModalHeader toggle={this.onDismiss}>Notificación</ModalHeader>
          <ModalBody>
            {this.state.mensaje}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.onDismiss}>Aceptar</Button>
          </ModalFooter>
        </Modal>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === "1" })}
              onClick={() => { this.toggle("1"); }}
            >
              Tus mensajes
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === "2" })}
              onClick={() => { this.toggle("2"); }}
            >
              Tus Publicaciones
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === "3" })}
              onClick={() => { this.toggle("3"); }}
            >
              Publicaciones
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <h1>Tus mensajes</h1>
                {this.darChats()}
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                {this.darPublicaciones()}
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="3">
            <Row>
              <Col sm="12">
                {this.renderListaPub()}
              </Col>
            </Row>
          </TabPane>
        </TabContent>
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
