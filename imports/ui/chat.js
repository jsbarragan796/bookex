import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { Meteor } from "meteor/meteor";
import {
  InputGroup,
  Media,
  Button,
  Input,
  InputGroupAddon,
  Form,
  Label,
  FormGroup,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter
} from "reactstrap";

export default class Chat extends Component {
  constructor (props) {
    super(props);
    this.state = {
      visibleModal: false,
      mensaje: ""
    };
    this.enviarMensaje = this.enviarMensaje.bind(this);
    this.eliminarChat = this.eliminarChat.bind(this);
    this.calificar = this.calificar.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onMostrar = this.onMostrar.bind(this);
  }
  onMostrar (nombreChat) {
    let msg = "Antes de terminar debes calificar a " + nombreChat + ".";
    this.setState({
      mensaje: msg,
      visibleModal: true });
  }

  onDismiss () {
    this.setState({ visibleModal: false });
  }

  renderizarMensajes () {
    let mensajes = this.props.mensajes.filter((n) =>
      (n.chatId === this.props.chatSeleccionado._id)
    );
    // const tam = (mensajes.length < 11) ? 0 : mensajes.length - 11;
    const tam = mensajes.length;
    mensajes = mensajes.slice(tam - 10);
    return mensajes.map((n) => {
      return (
        <Media key={n._id}>
          <Media body>
            <Media heading>
              {n.username1}
            </Media>
            {n.text}
          </Media>
        </Media>
      );
    });
  }
  eliminarChat (idChat) {
    Meteor.call("chat.remove", idChat);
    this.props.salirChat();
  }

  enviarMensaje (event) {
    event.preventDefault();
    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.mensaje).value.trim();

    /*
     Only inserts the message if the text has a content and is not
     and empty string
    */
    if (text !== "") {
      const ownerId2 = this.props.chatSeleccionado.ownerId2 === this.props.usuario._id ?
        this.props.chatSeleccionado.ownerId1 : this.props.chatSeleccionado.ownerId2;
      const name2 = this.props.chatSeleccionado.ownerId2 === this.props.usuario._id ?
        this.props.chatSeleccionado.username1 : this.props.chatSeleccionado.username2;
      const chatId = this.props.chatSeleccionado._id;

      // Sends the message to the db

      Meteor.call("noti.insert", text, ownerId2, chatId, name2, this.props.usuario.username);


      // Cleans the chat
      ReactDOM.findDOMNode(this.refs.mensaje).value = "";
    }
  }
  calificar (event) {
    event.preventDefault();
    // Find the text field via the React ref
    const calificacion = Number(ReactDOM.findDOMNode(this.refs.calificacion).value.trim());
    const ownerId2 = this.props.chatSeleccionado.ownerId2 === this.props.usuario._id ?
      this.props.chatSeleccionado.ownerId1 : this.props.chatSeleccionado.ownerId2;
    const name2 = this.props.chatSeleccionado.ownerId2 === this.props.usuario._id ?
      this.props.chatSeleccionado.username1 : this.props.chatSeleccionado.username2;
    let c = 0;
    let n = 0;
    if (this.props.calificaciones.length > 0) {
      function buscar (calificacion) {
        return (calificacion.idUser === ownerId2);
      }
      let cal = this.props.calificaciones.find(buscar);
      if (cal !== null && typeof cal !== "undefined") {
        c = cal.cantidad;
        n = cal.nota;
      }
    }
    n = c * n;
    n += calificacion;
    n = n / (c + 1);
    Meteor.call("add.calificacion", name2, ownerId2, n, c + 1);
    // this.props.enviarMensaje(text, ownerId2, chatId, name2);
    this.eliminarChat(this.props.chatSeleccionado._id);
    this.onDismiss();
    ReactDOM.findDOMNode(this.refs.calificacion).value = 1;
  }
  render () {
    return (
      <div>
        <Modal isOpen={this.state.visibleModal} toggle={this.onDismiss} className="Notificacion">
          <ModalHeader toggle={this.onDismiss}>Advertencia</ModalHeader>
          <ModalBody>
            <h4>{this.state.mensaje}</h4>
            <Form className="new-2" onSubmit={this.calificar}>
              <FormGroup>
                <InputGroup>
                  <Input className="abajo" type="select" name="calificacion" id="calificacion" ref="calificacion">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </Input>
                  <Button className="abajo" color="success">Calificar</Button>
                </InputGroup>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.onDismiss}>Cancelar</Button>
          </ModalFooter>
        </Modal>
        <Button onClick={this.props.salirChat} color="primary">Salir Chat</Button>
        {"  "}
        <Button
          onClick={() => {this.onMostrar(this.props.nombreChat);}} color="danger">
          Terminar Chat
        </Button>
        <h3>Calificacion del usuario: {this.props.calificacion}</h3>
        {this.renderizarMensajes()}
        <br />
        <Form className="new-task" onSubmit={this.enviarMensaje} >
          <FormGroup>
            <Label for="mensaje">Mensaje a enviar: </Label>
            <InputGroup>
              <Input
                id="mensaje"
                type="text"
                ref="mensaje"
                placeholder="Escribe un mensaje"
              />
              <InputGroupAddon addonType="append">
                <Button color="secondary">Enviar</Button>
              </InputGroupAddon>
            </InputGroup>
          </FormGroup>
        </Form>
      </div>
    );
  }
}

//prop types de chat
Chat.propTypes = {
  usuario: PropTypes.object,
  chatSeleccionado: PropTypes.object,
  salirChat: PropTypes.func,
  mensajes: PropTypes.array,
  calificaciones: PropTypes.array,
  calificacion: PropTypes.string,
  nombreChat: PropTypes.string
};
