import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { Meteor } from "meteor/meteor";
import {
  Button,
  Row,
  Card,
  Col,
  CardBody, CardSubtitle, CardTitle, CardText, CardFooter,
  Input,
  InputGroup,
  Form,
  Label,
  FormGroup
} from "reactstrap";

export default class ListaPublicaciones extends Component {
  constructor (props) {
    super(props);
    this.state = {
      crearPublicacion: false,
      publicacionSelected: null
    };
    this.seleccionarPublicacion = this.seleccionarPublicacion.bind(this);
    this.desSeleccionarPublicacion = this.desSeleccionarPublicacion.bind(this);
    this.crearComentario = this.crearComentario.bind(this);
    this.createChat = this.createChat.bind(this);
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
  createChat (idUser2, username2) {
    Meteor.call("chat.insert", idUser2, username2, this.props.usuario.username);
  }

  promedioNota (publicacion, notaNueva) {
    let total = publicacion.comentarios.length;
    let promedio = publicacion.nota * total;
    promedio = promedio + notaNueva;
    promedio = promedio / (total + 1);
    return promedio;
  }

  crearComentario (event) {
    event.preventDefault();
    // Find the text field via the React ref
    const texto = ReactDOM.findDOMNode(this.refs.comentario).value.trim();
    const nota = Number(ReactDOM.findDOMNode(this.refs.nota).value.trim());
    const addedAt = new Date();
    const commnet = { username: this.props.usuario.username, texto: texto, nota: nota, addedAt: addedAt };
    const nuevaNota = this.promedioNota(this.state.publicacionSelected, nota);
    const nuevosComentarios = this.state.publicacionSelected.comentarios.slice();
    nuevosComentarios.push(commnet);
    Meteor.call("comentario.update", this.state.publicacionSelected._id, nuevosComentarios, nuevaNota);
    ReactDOM.findDOMNode(this.refs.comentario).value = "";
    ReactDOM.findDOMNode(this.refs.nota).value = 1;
    this.desSeleccionarPublicacion();
  }

  renderizarPublicaciones () {
    let resp = "";
    if (this.state.publicacionSelected === null) {
      let publicaciones = this.props.publicaciones.filter((n) =>
        (n.ownerId !== this.props.usuario._id)
      );
      resp = publicaciones.map((publicacion) => {
        return (
          <Col sm="4" key={publicacion._id}>
            <Card>
              <CardBody>
                <CardTitle>{publicacion.titulo} </CardTitle>
                <CardSubtitle>{publicacion.autores}</CardSubtitle>
                <br />
                <CardTitle>Dueño: {publicacion.ownerName}</CardTitle>
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
                <Button
                  onClick= {() => {this.createChat(publicacion.ownerId, publicacion.ownerName);}}
                  color="primary" >Contactar a {publicacion.ownerName}
                </Button>
                <Button color="primary"
                  onClick={() => this.seleccionarPublicacion(publicacion)}>Ver comentarios</Button>
                <br />
                <CardFooter className="text-muted">
                  {/*Para que la fecha quede de la forma: "YYYY/MM/DD" */}
                  Comentado en : {publicacion.addedAt.toJSON().slice(0, 10).replace(/-/g, "/")}
                </CardFooter>
              </CardBody>
            </Card>
          </Col>
        );
      });
      resp = (<Row>{resp}</Row>);
    } else {
      resp = this.state.publicacionSelected.comentarios.map((n, i) => {
        return (
          <Col sm="4" key={i}>
            <Card>
              <CardBody>
                <CardTitle>Usuario: {n.username}</CardTitle>
                <CardSubtitle>Nota: {this.props.getNota(n.nota)}</CardSubtitle>
                <br />
                <CardText>
                  <strong> Comentario: </strong>{n.texto}
                </CardText>
                <br />
                <CardFooter className="text-muted">
                  {/*Para que la fecha quede de la forma: "YYYY/MM/DD" */}
                  Comentado en: {n.addedAt.toJSON().slice(0, 10).replace(/-/g, "/")}
                </CardFooter>
              </CardBody>
            </Card>
          </Col>
        );
      });
      resp = (
        <div>
          <h2>Comentarios publicacion del libro: {this.state.publicacionSelected.titulo}</h2>
          <Button onClick={this.desSeleccionarPublicacion} color="secondary">Regresar</Button>
          <Row>
            <Col sm="4">
              <Form className="new-comentario" onSubmit={this.crearComentario} >
                <Card>
                  <CardBody>
                    <CardTitle>Usuario: {this.props.usuario.username}</CardTitle>
                    <FormGroup>
                      <CardSubtitle>
                        <Label for="nota">Nota: </Label>
                        <Input type="select" name="nota" id="nota" ref="nota">
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                        </Input>
                      </CardSubtitle>
                    </FormGroup>

                    <br />

                    <FormGroup>

                      <Label for="comentario">Comentario : </Label>
                      <InputGroup>
                        <Input
                          id="comentario"
                          type="text"
                          ref="comentario"
                          placeholder="Escribe un mensaje"
                        />
                      </InputGroup>
                    </FormGroup>

                    <br/>
                    <Button color="primary">Comentar</Button>
                  </CardBody>
                </Card>
              </Form>
            </Col>
            {resp}
          </Row>
        </div>
      );
    }
    return resp;
  }
  render () {
    return (<div><h1>Publicaciones de los demas </h1>
      {this.renderizarPublicaciones()}</div>);
  }
}


//prop types de lista de publicaciones
ListaPublicaciones.propTypes = {
  usuario: PropTypes.object,
  publicaciones: PropTypes.array,
  getNota: PropTypes.func
};
