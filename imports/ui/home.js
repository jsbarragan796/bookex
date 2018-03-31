import React, { Component } from "react";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import classnames from "classnames";
import { ListGroup, ListGroupItem, Row, Col } from "reactstrap";

export default class Home extends Component {
  constructor (props) {
    super(props);
  }
  render () {
    const noti = this.props.noti.map((n, i) => {
      return (
        <ListGroupItem key={i}>
          {n.text}
        </ListGroupItem>
      );
    });
    return (
      <div>
        <Row>
          <Col sm="3">
            <h2>Notificaciones</h2>
            <ListGroup>
              {noti}
            </ListGroup>
          </Col>
          <Col sm="6">
            <p>hola</p>
          </Col>
          <Col sm="3">
            <p>hola</p>
          </Col>

        </Row>
        { this.props.usuario ?
          <form className="new-task" onSubmit={this.props.handle} >
            <input
              type="text"
              ref="textInput"
              placeholder="Type to add new tasks"
            />
          </form> : ""
        }
      </div>
    );
  }
}
