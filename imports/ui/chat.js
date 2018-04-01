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
  FormGroup } from "reactstrap";


export default class Chat extends Component {
  constructor (props) {
    super(props);
    this.enviarMensaje = this.enviarMensaje.bind(this);
    this.eliminarChat = this.eliminarChat.bind(this);
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
    Meteor.call("noti.insert", text, ownerId2, chatId, name2);
    // this.props.enviarMensaje(text, ownerId2, chatId, name2);

    ReactDOM.findDOMNode(this.refs.mensaje).value = "";
  }

  render () {
    return (
      <div>
        <Button onClick={this.props.salirChat} color="primary">Salir Chat</Button>
        <Button
          onClick={() => {this.eliminarChat(this.props.chatSeleccionado._id);}}
          color="danger">Terminar Chat
        </Button>
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
  mensajes: PropTypes.array
};
