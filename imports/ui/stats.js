import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Col,
  Card,
  Row,
  CardBody, CardSubtitle, CardTitle, CardText
} from "reactstrap";
export default class Stats extends Component {
  constructor (props) {
    super(props);
  }

  darPublicacionesOrdenadas (publicaciones, comparador) {
    let pup = publicaciones.slice();
    return pup.sort(comparador);
  }
  publicacionesNotaTop () {
    function comparadorNota (n1, n2) {
      if (n1.nota < n2.nota) {
        return -1;
      } else if (n1.nota > n2.nota) {
        return 1;
      } else {
        return 0;
      }
    }
    let publicaciones = this.darPublicacionesOrdenadas(this.props.publicaciones, comparadorNota);
    publicaciones = publicaciones.slice(0, 5);
    return (
      <Col sm="4">
        <Card>
          <CardBody>
            <CardTitle>Top 5 Publicaciones por nota</CardTitle>
            <CardSubtitle>Los 5 libros con mejores notas en el sistema</CardSubtitle>
            <CardText>
              {this.listaPublicaciones(publicaciones)}
            </CardText>
          </CardBody>
        </Card>
      </Col>
    );
  }

  publicacionesValorTop () {
    function comparadorNota (n1, n2) {
      if (n1.valorVenta < n2.valorVenta) {
        return -1;
      } else if (n1.valorVenta > n2.valorVenta) {
        return 1;
      } else {
        return 0;
      }
    }
    let publicaciones = this.darPublicacionesOrdenadas(this.props.publicaciones, comparadorNota);
    publicaciones = publicaciones.slice(0, 5);
    return (
      <Col sm="4">
        <Card>
          <CardBody>
            <CardTitle>Top 5 Publicaciones por valor venta</CardTitle>
            <CardSubtitle>Los 5 libros con mayor valor en el sistema</CardSubtitle>
            <CardText>
              {this.listaPublicaciones(publicaciones)}
            </CardText>
          </CardBody>
        </Card>
      </Col>
    );
  }
  publicacionesValorNoTop () {
    function comparadorNota (n1, n2) {
      if (n1.valorVenta < n2.valorVenta) {
        return 1;
      } else if (n1.valorVenta > n2.valorVenta) {
        return -1;
      } else {
        return 0;
      }
    }
    let publicaciones = this.darPublicacionesOrdenadas(this.props.publicaciones, comparadorNota);
    publicaciones = publicaciones.slice(0, 5);
    return (
      <Col sm="4">
        <Card>
          <CardBody>
            <CardTitle>Top 5 Publicaciones por valor venta</CardTitle>
            <CardSubtitle>Los 5 libros con menor valor en el sistema</CardSubtitle>
            <CardText>
              {this.listaPublicaciones(publicaciones)}
            </CardText>
          </CardBody>
        </Card>
      </Col>
    );
  }
  publicacionesComentarioTop () {
    function comparadorNota (n1, n2) {
      if (n1.comentarios.length < n2.comentarios.length) {
        return -1;
      } else if (n1.comentarios.length > n2.comentarios.length) {
        return 1;
      } else {
        return 0;
      }
    }
    let publicaciones = this.darPublicacionesOrdenadas(this.props.publicaciones, comparadorNota);
    publicaciones = publicaciones.slice(0, 5);
    return (
      <Col sm="4">
        <Card>
          <CardBody>
            <CardTitle>Top 5 Publicaciones por número comentarios</CardTitle>
            <CardSubtitle>Los 5 libros con más comentarios en el sistema</CardSubtitle>
            <CardText>
              {this.listaPublicaciones(publicaciones)}
            </CardText>
          </CardBody>
        </Card>
      </Col>
    );
  }
  listaPublicaciones (publicaciones) {
    return publicaciones.map((n) => {
      return (<li key={n._id}>
        Titulo: {n.titulo},
        Dueño: {n.ownerName}
      </li>);
    });
  }
  render () {
    return (
      <Row>
        {this.publicacionesNotaTop()}
        {this.publicacionesComentarioTop()}
        {this.publicacionesValorTop()}
        {this.publicacionesValorNoTop()}
      </Row>
    );
  }
}
//Props del Home
Stats.propTypes = {
  //Publicaciones
  publicaciones: PropTypes.array
};
