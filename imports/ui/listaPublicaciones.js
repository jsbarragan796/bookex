import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { Meteor } from "meteor/meteor";
import {
  Button,
  Row,
  Card,
  Col,
  CardBody, CardSubtitle, CardTitle, CardText, CardFooter
} from "reactstrap";

export default class ListaPublicaciones extends Component {
  constructor(props) {
    super(props);
    this.state = {
      crearPublicacion: false,
      publicacionSelected: null
    };
  }
  seleccionarPublicacion(publicacion) {
    this.setState({
      publicacionSelected: publicacion
    });
  }
  desSeleccionarPublicacion() {
    this.setState({
      publicacionSelected: null
    });
  }
  
  renderizarPublicaciones() {
    let publicaciones = this.props.publicaciones.filter((n) =>
      (n.ownerId !== this.props.usuario._id)
    );
    let listaPublicaciones = publicaciones.map((publicacion) => {
      return (
        <Col sm="4" key={publicacion._id}>
          <Card>
            <CardBody>
              <CardTitle>{publicacion.titulo}</CardTitle>
              <CardSubtitle>{publicacion.autores}</CardSubtitle>
              <br />
              <CardText>
                <strong> Editorial: </strong>{publicacion.autores}
                <br />
                <strong> Edición: </strong>{publicacion.edicion}
                <br />
                <strong> Genero: </strong>{publicacion.genero}
                <br />
                <strong> ISBN: </strong>{publicacion.isbn}
                <br />
                <strong> Editorial: </strong>{publicacion.autores}
                <br />
                <strong> Estado: </strong>{publicacion.estado}
                <br />
                <strong> Motivo publicación: </strong>{publicacion.para}
                <br />
                <strong> Valoracion: </strong>{publicacion.valorVenta}
                <br />
                <strong> Nota: </strong> {this.props.getNota(publicacion.nota)}
              </CardText>
              <Button color="primary" >Contactar dueño</Button>
              <br />
              <CardFooter className="text-muted">
                {/*Para que la fecha quede de la forma: "YYYY/MM/DD" */}
                Publicado el: {publicacion.addedAt.toJSON().slice(0, 10).replace(/-/g, "/")}
              </CardFooter>
            </CardBody>
          </Card>
        </Col>
      );
    });
    return listaPublicaciones;
  }
  render() {
    return (<div><h1>Publicaciones de los demas </h1>
      <Row>{this.renderizarPublicaciones()}</Row></div>);
  }
}


//prop types de lista de publicaciones
ListaPublicaciones.propTypes = {
  usuario: PropTypes.object,
  publicaciones: PropTypes.array
};
