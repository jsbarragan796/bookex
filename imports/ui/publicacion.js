import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { Meteor } from "meteor/meteor";
import {
  Media,
  Button,
  Input,
  FormGroup,
  Form,
  Row,
  Col,
  Label,
  Card,
  CardBody, CardSubtitle, CardTitle, CardText, CardFooter } from "reactstrap";
export default class Publicacion extends Component {
  constructor (props) {
    super(props);
    this.state = {
      crearPublicacionNueva: false,
      publicacionSelected: null
    };
    this.agregarPublicacion = this.agregarPublicacion.bind(this);
    this.cambioVista = this.cambioVista.bind(this);
    this.seleccionarPublicacion = this.seleccionarPublicacion.bind(this);
    this.desSeleccionarPublicacion = this.desSeleccionarPublicacion.bind(this);
    this.eliminarPublicacion = this.eliminarPublicacion.bind(this);
    this.nuevaPublicacion = this.nuevaPublicacion.bind(this);
    this.actualizarCampos = this.actualizarCampos.bind(this);
    this.buscarEnElementosPublicacion = this.buscarEnElementosPublicacion.bind(this);
    this.darElementosOwner = this.darElementosOwner.bind(this);
  }
  componentDidUpdate () {
    this.actualizarCampos();
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
  buscarEnElementosPublicacion (elementos) {
    let encontro = false;
    for (var i = 0; i < elementos.length && !encontro; i++) {
      if (elementos[i].ownerId === this.props.usuario._id) {
        encontro = true;
      }
    }
    return encontro;
  }
  renderizarPublicaciones () {
    let publicaciones = this.props.publicaciones.filter((n) =>
      this.buscarEnElementosPublicacion(n.elementos)
    );

    return publicaciones.map((n) => {
      return (
        // Interfaz Simple para las publicaciones
        <div key={n._id}>
          <Media >
            <Media body>
              <Media heading>
                Titulo: {n.titulo}
              </Media>
              Autor: {n.autores}
              Editorial:  {n.editorial}
              <Button
                onClick={() => this.seleccionarPublicacion(n)} color="primary">
              ver detalle</Button>
            </Media>
          </Media>
          <hr/>
        </div>
      );
    });
  }

  darElementosOwner (publicacion) {
    let elementosOwner = [];
    for (var i = 0; i < publicacion.elementos.length; i++) {
      if (publicacion.elementos[i].ownerId === this.props.usuario._id) {
        elementosOwner.push(publicacion.elementos[i]);
      }
    }
    let resp = elementosOwner.map((elemento, i) => {
      return (
        <Col sm="4" key={i}>
          <Card>
            <CardBody>
              <CardTitle>{publicacion.titulo}</CardTitle>
              <CardSubtitle>{publicacion.autores}</CardSubtitle>
              <br/>
              <CardText>
                <strong> Estado: </strong>{elemento.estado}
                <br/>
                <strong> Motivo publicación: </strong>{elemento.para}
                <br/>
              </CardText>
              <Button color="danger" onClick={() => this.eliminarPublicacion(elemento)}>Eliminar</Button>
              <br/>
              <CardFooter className="text-muted">
                Publicado el: {elemento.addedAt.toJSON().slice(0, 10).replace(/-/g, "/")}
              </CardFooter>
            </CardBody>
          </Card>
        </Col>
      );
    });
    return resp;
  }
  renderizarPublicacion () {
    const publicacion = this.state.publicacionSelected;
    return (
      <div>
        <Row>
          <p>
            <strong> Editorial: </strong>{publicacion.autores}
            <br/>
            <strong> Edición: </strong>{publicacion.edicion}
            <br/>
            <strong> Genero: </strong>{publicacion.genero}
            <br/>
            <strong> Nota: </strong> {this.props.getNota(publicacion.nota)}
          </p>
          <Button onClick={this.desSeleccionarPublicacion} color="primary">Atras</Button>
        </Row>
        <Row>
          {this.darElementosOwner(publicacion)}
        </Row>
      </div>
    );
  }
  cambioVista () {
    if (this.props.publicacionExistente !== null && typeof this.props.publicacionExistente !== "undefined") {
      this.props.quitarPublicacion();
    } else {
      this.setState({
        crearPublicacionNueva: !this.state.crearPublicacionNueva
      });
    }
  }

  eliminarPublicacion (elemento) {
    if (this.state.publicacionSelected.elementos.length === 1) {
      Meteor.call("publicacion.remove", this.state.publicacionSelected._id);
    } else {
      let elementos = this.state.publicacionSelected.elementos;
      let index = -1;
      for (var i = 0; i < elementos.length && index === -1; i++) {
        if (elementos[i].ownerId === elemento.ownerId &&
          elementos[i].addedAt.getTime() === elemento.addedAt.getTime()) {
          index = i;
        }
      }
      elementos.splice(index, 1);
      Meteor.call("publicacion.update.elementos", this.state.publicacionSelected._id, elementos);
    }
    this.desSeleccionarPublicacion();
  }
  agregarPublicacion (event) {
    event.preventDefault();
    // Si la publicacion ya existe solo se agrega un elemento de lo contrario se crea uno nuevo
    if (this.props.publicacionExistente !== null && typeof this.props.publicacionExistente !== "undefined") {
      const estado = ReactDOM.findDOMNode(this.refs.estado).value.trim();
      const para = ReactDOM.findDOMNode(this.refs.para).value.trim();
      const elementos = this.props.publicacionExistente.elementos;
      let elementoNuevo = { estado: estado, para: para,
        addedAt: new Date(), ownerId: this.props.usuario._id, ownerName: this.props.usuario.username };
      elementos.push(elementoNuevo);
      Meteor.call("publicacion.update.elementos", this.props.publicacionExistente._id, elementos);
    } else {
      // Find all the  field via the React ref
      const titulo = ReactDOM.findDOMNode(this.refs.titulo).value.trim();
      const autores = ReactDOM.findDOMNode(this.refs.autores).value.trim();
      const editorial = ReactDOM.findDOMNode(this.refs.editorial).value.trim();
      const edicion = ReactDOM.findDOMNode(this.refs.edicion).value.trim();
      const genero = ReactDOM.findDOMNode(this.refs.genero).value.trim();
      const estado = ReactDOM.findDOMNode(this.refs.estado).value.trim();
      const para = ReactDOM.findDOMNode(this.refs.para).value.trim();
      const publicacion = { titulo: titulo, autores: autores, editorial: editorial, edicion: edicion,
        genero: genero, estado: estado, para: para };
      // Guardar publicacion
      Meteor.call("publicacion.insert", publicacion, this.props.usuario.username);
    }
    // Find an creal all the field via the React ref
    ReactDOM.findDOMNode(this.refs.titulo).value = "";
    ReactDOM.findDOMNode(this.refs.autores).value = "";
    ReactDOM.findDOMNode(this.refs.editorial).value = "";
    ReactDOM.findDOMNode(this.refs.edicion).value = "";
    ReactDOM.findDOMNode(this.refs.estado).value = "";
    ReactDOM.findDOMNode(this.refs.para).value = "";
    ReactDOM.findDOMNode(this.refs.genero).value = "";
    this.cambioVista();
  }

  actualizarCampos () {
    if (this.props.publicacionExistente !== null && typeof this.props.publicacionExistente !== "undefined") {
      ReactDOM.findDOMNode(this.refs.titulo).value = this.props.publicacionExistente.titulo;
      ReactDOM.findDOMNode(this.refs.autores).value = this.props.publicacionExistente.autores;
      ReactDOM.findDOMNode(this.refs.editorial).value = this.props.publicacionExistente.editorial;
      ReactDOM.findDOMNode(this.refs.edicion).value = this.props.publicacionExistente.edicion;
      ReactDOM.findDOMNode(this.refs.genero).value = this.props.publicacionExistente.genero;
    }
  }

  darAnios () {
    let a = [];
    for (var i = 2018; i > 1800; i--) {
      a.push(<option key={i}>{i}</option>);
    }
    return a;
  }
  darGeneros () {
    let a = ["Policial", "Romántica",
      "Aventura",
      "Terror",
      "Ciencia Ficción",
      "Investigación",
      "Biográfica",
      "Infantil",
      "Autoaydua",
      "Erótica",
      "Hogar",
      "Enciclopedia",
      "Manual",
      "Política",
      "Economía",
      "Sociedad",
      "Deportes",
      "Viajes",
      "Cultura",
      "Otros temas"];
    return a.map((n, i) => {
      return (<option key={i}>{n}</option>);
    });
  }
  nuevaPublicacion (deshabilitar) {
    return (<div>
      <h1>Publicación a crear</h1>
      <Form className="new-Publicacion" onSubmit={this.agregarPublicacion} >
        <FormGroup>
          <Label for="titulo">Titulo: </Label>
          <Input
            id="titulo"
            type="text"
            ref="titulo"
            placeholder="Escribe el titulo"
            disabled = {deshabilitar}
          />
        </FormGroup>
        <FormGroup>
          <Label for="autores"> Autor(es): </Label>
          <Input
            id="autores"
            type="text"
            ref="autores"
            placeholder="Escribe autor (es)"
            disabled = {deshabilitar}
          />
        </FormGroup>
        <FormGroup>
          <Label for="editorial"> Editorial: </Label>
          <Input
            id="editorial"
            type="text"
            ref="editorial"
            placeholder="Escribe la editorial"
            disabled = {deshabilitar}
          />
        </FormGroup>
        <FormGroup>
          <Label for="edicion">Edicion</Label>
          <Input type="select" name="edicion" id="edicion" ref="edicion" disabled = {deshabilitar}>
            {this.darAnios()}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="genero">Género</Label>
          <Input type="select" name="genero" id="genero" ref="genero" disabled = {deshabilitar}>
            {this.darGeneros()}
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="estado">Estado</Label>
          <Input type="select" name="estado" id="estado" ref="estado">
            <option>Malo</option>
            <option>Regular</option>
            <option>Aceptable</option>
            <option>Excelente</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="para">Intención de la publicación</Label>
          <Input type="select" name="para" id="para" ref="para">
            <option>Regalar</option>
            <option>Vender</option>
            <option>Cambiar</option>
          </Input>
        </FormGroup>
        <Button color="primary">Crear</Button>
        <Button onClick={this.cambioVista} color="danger">Cancelar</Button>
      </Form>
    </div>);
  }

  publicacionExistente () {
    let resp = this.nuevaPublicacion(true);
    return resp;
  }

  crearCuerpo () {
    let resp = "";
    if (this.state.crearPublicacionNueva) {
      resp = this.nuevaPublicacion(false);
    } else if (this.props.publicacionExistente !== null && typeof this.props.publicacionExistente !== "undefined") {
      resp = this.publicacionExistente();
    } else {
      let resp2 = "";
      if (this.state.publicacionSelected === null) {
        resp2 = this.renderizarPublicaciones();
      } else {
        resp2 = this.renderizarPublicacion();
      }
      resp = (<div>
        <h1>Tus Publicaciones  </h1>  <Button onClick={this.cambioVista} color="primary">Crear publicacion</Button>
        <hr/>
        {resp2}
        <br />
      </div>);
    }

    return resp;
  }

  render () {
    return (
      <div>
        {this.crearCuerpo()}
      </div>
    );
  }
}

//prop types de chat
Publicacion.propTypes = {
  usuario: PropTypes.object,
  publicaciones: PropTypes.array,
  getNota: PropTypes.func,
  publicacionExistente: PropTypes.object,
  quitarPublicacion: PropTypes.func
};
