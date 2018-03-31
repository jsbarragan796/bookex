import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { Meteor } from "meteor/meteor";
import {
  Button,
  Row,
  Card,
  Col,
  CardBody, CardSubtitle, CardTitle, CardText, CardFooter } from "reactstrap";

export default class ListaPublicaciones extends Component {
  constructor (props) {
    super(props);
    this.state = {
      crearPublicacion: false,
      publicacionSelected: null
    };
  }
  seleccionarPublicacion (publicacion) {
    this.setState({
      publicacionSelected: publicacion
    });
  }
  desSeleccionarPublicacion () {
    this.setState({
      publicacionSelected: null
    });
  }
  getNota (nota) {
    let resp = "";
    for (var i = 0; i < nota; i++) {
      resp = resp + "⭐";
    }
    return resp;
  }
  renderizarPublicaciones () {
    let publicaciones = this.props.publicaciones.filter((n) =>
      (n.ownerId !== this.props.usuario._id)
    );
    let listaPublicaciones = publicaciones.map((publicacion) => {
      return (<Col sm="4">
        <Card key={publicacion._id}>
          <CardBody>
            <CardTitle>{publicacion.titulo}</CardTitle>
            <CardSubtitle>{publicacion.autores}</CardSubtitle>
            <br/>
            <CardText>
              <strong> Editorial: </strong>{publicacion.autores}
              <br/>
              <strong> Edición: </strong>{publicacion.edicion}
              <br/>
              <strong> Genero: </strong>{publicacion.genero}
              <br/>
              <strong> ISBN: </strong>{publicacion.isbn}
              <br/>
              <strong> Editorial: </strong>{publicacion.autores}
              <br/>
              <strong> Estado: </strong>{publicacion.estado}
              <br/>
              <strong> Motivo publicación: </strong>{publicacion.para}
              <br/>
              <strong> Valoracion: </strong>{publicacion.valorVenta}
              <br/>
              <strong> Nota: </strong> {this.getNota(publicacion.nota)}
            </CardText>
            <Button color="primary" >Contactar dueño</Button>
            <br/>
            <CardFooter className="text-muted">
              Publicado el: {publicacion.addedAt.toJSON().slice(0, 10).replace(/-/g, "/")}
            </CardFooter>
          </CardBody>
        </Card>
      </Col>);
    });
    return listaPublicaciones;
  }
  render () {
    return (<div><h1>Publicaciones de los demas </h1>
      <Row>{this.renderizarPublicaciones()}</Row></div>);
  }
}


//prop types de lista de publicaciones
ListaPublicaciones.propTypes = {
  usuario: PropTypes.object,
  publicaciones: PropTypes.array
};
