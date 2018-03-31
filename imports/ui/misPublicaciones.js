import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import { Tracker } from "meteor/tracker";
import { Publicaciones } from "../api/publicaciones.js";
import { Comentarios } from "../api/publicaciones.js";
import { InputGroup, Media, Button, Input, InputGroupAddon } from "reactstrap";


export default class Chat extends Component {
  constructor (props) {
    super(props);
    this.state = {
      mensajes: []
    };
    this.enviarMensaje = this.enviarMensaje.bind(this);
  }
  componentDidMount () {
    Tracker.autorun(() => {
      Meteor.subscribe("notificaciones");
      this.setState({
        mensajes: Publicaciones.find({ chatId: this.props.chat._id }).fetch()
      });
    });
  }
  enviarMensaje () {
    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.mensaje).value.trim();
    const ownerId2 = this.props.chat.ownerId2 === this.props.usuario._id ?
      this.props.chat.ownerId1 : this.props.chat.ownerId2;
    const name2 = this.props.chat.ownerId2 === this.props.usuario._id ?
      this.props.chat.username1 : this.props.chat.username2;
    const chatId = this.props.chat._id;
    console.log("data " + text + " " + ownerId2 + " " + chatId);
    Meteor.call("noti.insert", text, ownerId2, chatId, name2);
    ReactDOM.findDOMNode(this.refs.mensaje).value = "";
  }

  render () {
    const notificaciones = this.state.mensajes.map((n, i) => {
      return (
        <Media key={i}>
          <Media body>
            <Media heading>
              {n.username1}
            </Media>
            {n.text}
          </Media>
        </Media>
      );
    });
    return (
      <div>
        <Button onClick={this.props.salirChat} color="primary">Salir Chat</Button>
        {notificaciones}
        <br />
        <InputGroup>
          <Input
            id="mensaje"
            type="text"
            ref="mensaje"
            placeholder="Escribe un mensaje"
          />
          <InputGroupAddon addonType="append">
            <Button onClick={this.enviarMensaje} color="secondary">Enviar</Button>
          </InputGroupAddon>
        </InputGroup>
      </div>
    );
  }
}
Chat.propTypes = {
  usuario: PropTypes.object,
  chat: PropTypes.object,
  salirChat: PropTypes.func
};
