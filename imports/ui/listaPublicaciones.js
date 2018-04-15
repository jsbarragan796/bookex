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
  FormGroup,
  Pagination,
  PaginationItem,
  PaginationLink
} from "reactstrap";
import { isNull } from "util";

export default class ListaPublicaciones extends Component {
  constructor(props) {
    super(props);
    this.state = {
      crearPublicacion: false,
      publicacionSelected: null,
      page: 0
    };
    this.seleccionarPublicacion = this.seleccionarPublicacion.bind(this);
    this.desSeleccionarPublicacion = this.desSeleccionarPublicacion.bind(this);
    this.crearComentario = this.crearComentario.bind(this);
    this.createChat = this.createChat.bind(this);
    this.updatePagination = this.updatePagination.bind(this);
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
  createChat(idUser2, username2) {
    Meteor.call("chat.insert", idUser2, username2, this.props.usuario.username);
  }

  promedioNota(publicacion, notaNueva) {
    let total = publicacion.comentarios.length;
    let promedio = publicacion.nota * total;
    promedio = promedio + notaNueva;
    promedio = promedio / (total + 1);
    return promedio;
  }

  crearComentario(event) {
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

  updatePagination(pagina, fin) {
    // updates only if the new page is different from the actual page
    if (this.state.page !== pagina) {
      let nextPage = null; //the number on the new page
      let actual = this.state.page; //the current page

      // calculates the new page
      if (pagina === "next" && actual + 1 < fin) nextPage = actual + 1;
      if (pagina === "prev" && actual > 0) nextPage = actual - 1;
      if (!isNaN(pagina)) nextPage = pagina;

      // updates if there was a page calculated
      if(!isNull(nextPage)){
        //Updates the state with the new page
      this.setState({ page: nextPage });
      }

    }
  }

  // this renders the pagination
  renderPagination() {
    //the tam of the list
    let tam = this.props.publicaciones.filter((n) =>
      (n.ownerId !== this.props.usuario._id)
    ).length;

    // Calculates the number of pages
    /* Math.floor(tam / 20) + 1 */
    const pages = 6;
    // Calculates the current page
    const currentPage = this.state.page;
    // Checks if the user is in the last page or not
    const end = pages === currentPage + 1;
    // Checks if the user is on the first page or not
    const start = currentPage === 0;
    // The array of pagination items
    let items = Array(pages);
    for (let index = 0; index < items.length; index++) {
      items[index] = (
        <PaginationItem
          onClick={() => this.updatePagination(index)}
          key={index}
          active={index === currentPage}>
          <PaginationLink>
            {index + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return (
      <Pagination>
        <PaginationItem
          onClick={() => this.updatePagination("prev")}
          disabled={start} >
          <PaginationLink previous />
        </PaginationItem>
        {items}
        <PaginationItem
          onClick={() => this.updatePagination("next", items.length)}
          disabled={end}  >
          <PaginationLink next />
        </PaginationItem>
      </Pagination>
    );
  }

  renderizarPublicaciones() {
    let resp = "";
    if (this.state.publicacionSelected === null) {
      // Creates the boundary of the publications
      let inicio = this.state.page * 20;
      let fin = inicio + 19;
      // Filters all publications based on the range and owner
      let publicaciones = this.props.publicaciones.filter((n, i) =>
        (n.ownerId !== this.props.usuario._id && inicio <= i && i <= fin)
      );

      // Makes the card for every publication
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
                  onClick={() => { this.createChat(publicacion.ownerId, publicacion.ownerName); }}
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

      //wraps the resp on the appropiate component
      resp = (
        <div>
          <Row>{resp}</Row>
          <br />
          {this.renderPagination()}
        </div>
      );
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

                    <br />
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
  render() {
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
