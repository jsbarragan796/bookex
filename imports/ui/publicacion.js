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
  Label,
  Card,
  CardBody, CardSubtitle, CardTitle, CardText, CardFooter } from "reactstrap";
export default class Publicacion extends Component {
  constructor (props) {
    super(props);
    this.state = {
      crearPublicacion: false,
      publicacionSelected: null
    };
    this.agregarPublicacion = this.agregarPublicacion.bind(this);
    this.cambioVista = this.cambioVista.bind(this);
    this.seleccionarPublicacion = this.seleccionarPublicacion.bind(this);
    this.desSeleccionarPublicacion = this.desSeleccionarPublicacion.bind(this);
    this.eliminarPublicacion = this.eliminarPublicacion.bind(this);
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

  renderizarPublicaciones () {
    let publicaciones = this.props.publicaciones.filter((n) =>
      (n.ownerId === this.props.usuario._id)
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
              Autor: {n.autores} <Button
                onClick={() => this.seleccionarPublicacion(n)} color="primary">
              ver detalle</Button>
            </Media>
          </Media>
          <hr/>
        </div>
      );
    });
  }

  renderizarPublicacion () {
    const publicacion = this.state.publicacionSelected;
    return (
    // mejorar interfaz !!
      <Card>
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
            <strong> Nota: </strong> {this.props.getNota(publicacion.nota)}
          </CardText>
          <Button color="danger" onClick={this.eliminarPublicacion}>Eliminar</Button>
          <br/>
          <Button onClick={this.desSeleccionarPublicacion} color="primary">Atras</Button>
          <CardFooter className="text-muted">
            Publicado el: {publicacion.addedAt.toJSON().slice(0, 10).replace(/-/g, "/")}
          </CardFooter>
        </CardBody>
      </Card>
    );
  }
  cambioVista () {
    this.setState({
      crearPublicacion: !this.state.crearPublicacion
    });
  }

  eliminarPublicacion () {
    Meteor.call("publicacion.remove", this.state.publicacionSelected._id);
    this.desSeleccionarPublicacion();
  }
  agregarPublicacion (event) {
    event.preventDefault();
    // Find all the  field via the React ref
    const titulo = ReactDOM.findDOMNode(this.refs.titulo).value.trim();
    const autores = ReactDOM.findDOMNode(this.refs.autores).value.trim();
    const editorial = ReactDOM.findDOMNode(this.refs.editorial).value.trim();
    const edicion = ReactDOM.findDOMNode(this.refs.edicion).value.trim();
    const genero = ReactDOM.findDOMNode(this.refs.genero).value.trim();
    const isbn = ReactDOM.findDOMNode(this.refs.isbn).value.trim();
    const estado = ReactDOM.findDOMNode(this.refs.estado).value.trim();
    const para = ReactDOM.findDOMNode(this.refs.para).value.trim();
    const valorVenta = ReactDOM.findDOMNode(this.refs.valorVenta).value.trim();
    const publicacion = { titulo: titulo, autores: autores, editorial: editorial, edicion: edicion,
      genero: genero, isbn: isbn, estado: estado, para: para, valorVenta: valorVenta };
    // Guardar publicacion
    Meteor.call("publicacion.insert", publicacion);

    // Find an creal all the field via the React ref
    ReactDOM.findDOMNode(this.refs.titulo).value = "";
    ReactDOM.findDOMNode(this.refs.autores).value = "";
    ReactDOM.findDOMNode(this.refs.editorial).value = "";
    ReactDOM.findDOMNode(this.refs.edicion).value = "";
    ReactDOM.findDOMNode(this.refs.isbn).value = "";
    ReactDOM.findDOMNode(this.refs.estado).value = "";
    ReactDOM.findDOMNode(this.refs.para).value = "";
    ReactDOM.findDOMNode(this.refs.valorVenta).value = "";
    ReactDOM.findDOMNode(this.refs.genero).value = "";

    this.cambioVista();
  }


  darAnios () {
    let a = [];
    for (var i = 1800; i < 2018; i++) {
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

  crearCuerpo () {
    let resp = "";
    if (this.state.crearPublicacion) {
      resp = (<div>
        <h1>Publicación a crear</h1>
        <Form className="new-Publicacion" onSubmit={this.agregarPublicacion} >
          <FormGroup>
            <Label for="titulo">Titulo: </Label>
            <Input
              id="titulo"
              type="text"
              ref="titulo"
              placeholder="Escribe el titulo"
            />
          </FormGroup>
          <FormGroup>
            <Label for="autores"> Autor(es): </Label>
            <Input
              id="autores"
              type="text"
              ref="autores"
              placeholder="Escribe autor (es)"
            />
          </FormGroup>
          <FormGroup>
            <Label for="editorial"> Editorial: </Label>
            <Input
              id="editorial"
              type="text"
              ref="editorial"
              placeholder="Escribe la editorial"
            />
          </FormGroup>
          <FormGroup>
            <Label for="edicion">Edicion</Label>
            <Input type="select" name="edicion" id="edicion" ref="edicion">
              {this.darAnios()}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="genero">Edicion</Label>
            <Input type="select" name="genero" id="genero" ref="genero">
              {this.darGeneros()}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="isbn">Isbn</Label>
            <Input type="number" name="isbn" id="isbn" ref="isbn"/>
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
          <FormGroup>
            <Label for="valorVenta">¿ En cuanto valoras el libro en COPs?</Label>
            <Input type="number" name="valorVenta" id="valorVenta" ref="valorVenta"/>
          </FormGroup>
          <Button color="primary">Crear</Button>
          <Button onClick={this.cambioVista} color="danger">Cancelar</Button>
        </Form>
      </div>);
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
  publicaciones: PropTypes.array
};
