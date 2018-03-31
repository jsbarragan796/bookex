import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import { ListGroup, ListGroupItem, Row, Col, Button, Form, Label, Input } from "reactstrap";
import ReactDOM from "react-dom";
import { Notificaciones } from "../api/notificaciones.js";
import { Chats } from "../api/notificaciones.js";
import Chat from "./chat.js";
import { Session } from "meteor/session";
class Home extends Component {
  constructor (props) {
    super(props);
    this.state = {
      chatSeleccionado: null
    };
    this.createChat = this.createChat.bind(this);
    this.seleccionarChat = this.seleccionarChat.bind(this);
  }
  createChat (event) {
    event.preventDefault();
    // Find the text field via the React ref
    const idUser2 = ReactDOM.findDOMNode(this.refs.idUser2).value.trim();
    Meteor.call("chat.insert", idUser2);
    ReactDOM.findDOMNode(this.refs.idUser2).value = "";
  }
  seleccionarChat (chat) {
    Session.setDefault("chatId", chat._id);
    this.setState({
      chatSeleccionado: chat
    });
  }
  desSeleccionarChat () {
    Session.set("chatId", undefined);
    this.setState({
      chatSeleccionado: null
    });
  }

  render () {
    let chats = "";
    if (this.state.chatSeleccionado === null) {
      chats = this.props.chats.map((n, i) => {
        return (
          <ListGroupItem onClick={() => this.seleccionarChat(n)} tag="button" key={i} action>
            {n.username1 === this.props.usuario.username ? n.username2 : n.username1}
          </ListGroupItem>
        );
      });
    } else {
      chats = (
        <Chat salirChat={() => this.desSeleccionarChat()} usuario={this.props.usuario}
          chat={this.state.chatSeleccionado}/>
      );
    }
    return (
      <div>
        <Row>
          <Col sm="3">
            <h2>Tus Mensajes</h2>
            <Form className="new-task" onSubmit={this.createChat} >
              <Label for="idUser2">Temporal, colocar id usuario a contactar</Label>
              <Input
                id="idUser2"
                type="text"
                ref="idUser2"
                placeholder="usuario 2 id"
              />
              <Button>Crear hilo chat</Button>
            </Form>
            <ListGroup>
              {chats}
            </ListGroup>
          </Col>
          <Col sm="6">
            <p>hola</p>
          </Col>
          <Col sm="3">
            <p>hola</p>
          </Col>

        </Row>
      </div>
    );
  }
}
Home.propTypes = {
  notificaciones: PropTypes.array,
  usuario: PropTypes.object,
  chats: PropTypes.array
};


export default withTracker(() => {
  // Meteor.subscribe("notificaciones");
  Meteor.subscribe("chats");
  return {
    notificaciones: Notificaciones.find({}).fetch(),
    chats: Chats.find({}).fetch()
  };
})(Home);