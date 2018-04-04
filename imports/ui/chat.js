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
  Card} from "reactstrap";


export default class Chat extends Component {
  constructor (props) {
    super(props);
    this.enviarMensaje = this.enviarMensaje.bind(this);
    this.eliminarChat = this.eliminarChat.bind(this);
    this.calificar = this.calificar.bind(this);
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
    const ownerId2 = this.props.chatSeleccionado.ownerId2 === this.props.usuario._id ?
      this.props.chatSeleccionado.ownerId1 : this.props.chatSeleccionado.ownerId2;
    const name2 = this.props.chatSeleccionado.ownerId2 === this.props.usuario._id ?
      this.props.chatSeleccionado.username1 : this.props.chatSeleccionado.username2;
    const chatId = this.props.chatSeleccionado._id;
    Meteor.call("noti.insert", text, ownerId2, chatId, name2, this.props.usuario.username);
    // this.props.enviarMensaje(text, ownerId2, chatId, name2);

    ReactDOM.findDOMNode(this.refs.mensaje).value = "";
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

    ReactDOM.findDOMNode(this.refs.calificacion).value = 1;
  }
  render () {
    return (
      <Card body>
        {
          //Seria util 'encapsular' el contenido del chat de una manera mas visible, como con un Card de Bootstrap
        }
        <Button onClick={this.props.salirChat} color="primary">Salir Chat</Button>
        <Button
          onClick={() => {this.eliminarChat(this.props.chatSeleccionado._id);}} color="danger">
          Terminar Chat
        </Button>
        <h3>Calificacion del usuario: {this.props.calificacion}</h3>
        {
          //Se podria agregar a este componenete el nombre del usuario con quien se realiza el chat, con ayuda de props.usuario
        }
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
        <hr/>
        <h3>Calificar usuario</h3>
        <Form className="new-2" onSubmit={this.calificar}>
          <FormGroup>
            <InputGroup>
              <Label for="calificacion">Nota: </Label>
              <Input type="select" name="calificacion" id="calificacion" ref="calificacion">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </Input>
              <Button color="success">Calificar</Button>
            </InputGroup>
          </FormGroup>
        </Form>
      </Card>
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
  calificacion: PropTypes.string
};
