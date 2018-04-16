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
  usuarioNotaTop () {
    function comparadorNota (n1, n2) {
      if (n1.nota < n2.nota) {
        return 1;
      } else if (n1.nota > n2.nota) {
        return -1;
      } else {
        return 0;
      }
    }
    let calificaciones = this.darPublicacionesOrdenadas(this.props.calificaciones, comparadorNota);
    calificaciones = calificaciones.slice(0, 5);
    return (
      <Col sm="4" className="abajo">
        <Card>
          <CardBody>
            <CardTitle>Top 5  mejores usuarios</CardTitle>
            <CardSubtitle>Los 5 usuarios con mejores calificaciones en Bookex</CardSubtitle>
            <CardText role="list">

              {this.listaCalificaciones(calificaciones)}

            </CardText>
          </CardBody>
        </Card>
      </Col>
    );
  }
  usuarioNotaNoTop () {
    function comparadorNota (n1, n2) {
      if (n1.nota < n2.nota) {
        return -1;
      } else if (n1.nota > n2.nota) {
        return 1;
      } else {
        return 0;
      }
    }
    let calificaciones = this.darPublicacionesOrdenadas(this.props.calificaciones, comparadorNota);
    calificaciones = calificaciones.slice(0, 5);
    return (
      <Col sm="4" className="abajo">
        <Card>
          <CardBody>
            <CardTitle>Top 5 peores usuarios</CardTitle>
            <CardSubtitle>Los 5 usuarios con peores calificaciones en Bookex</CardSubtitle>
            <CardText role="list">

              {this.listaCalificaciones(calificaciones)}

            </CardText>
          </CardBody>
        </Card>
      </Col>
    );
  }
  publicacionesNotaTop () {
    function comparadorNota (n1, n2) {
      if (n1.nota < n2.nota) {
        return 1;
      } else if (n1.nota > n2.nota) {
        return -1;
      } else {
        return 0;
      }
    }
    let publicaciones = this.darPublicacionesOrdenadas(this.props.publicaciones, comparadorNota);
    publicaciones = publicaciones.slice(0, 5);
    return (
      <Col sm="4" className="abajo">
        <Card>
          <CardBody>
            <CardTitle>Top 5 Publicaciones por nota</CardTitle>
            <CardSubtitle>Los 5 libros con mejores notas en Bookex</CardSubtitle>
            <CardText role="list">

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
      <Col sm="4" className="abajo">
        <Card>
          <CardBody>
            <CardTitle>Top 5 Publicaciones mayor valor venta</CardTitle>
            <CardSubtitle>Los 5 libros con mayor valor en Bookex</CardSubtitle>
            <CardText role="list">

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
      <Col sm="4" className="abajo">
        <Card>
          <CardBody>
            <CardTitle>Top 5 Publicaciones menor valor venta</CardTitle>
            <CardSubtitle>Los 5 libros con menor valor en Bookex</CardSubtitle>
            <CardText role="list">

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
        return 1;
      } else if (n1.comentarios.length > n2.comentarios.length) {
        return -1;
      } else {
        return 0;
      }
    }
    let publicaciones = this.darPublicacionesOrdenadas(this.props.publicaciones, comparadorNota);
    publicaciones = publicaciones.slice(0, 5);
    return (
      <Col sm="4" className="abajo">
        <Card>
          <CardBody>
            <CardTitle>Top 5 Publicaciones por número comentarios</CardTitle>
            <CardSubtitle>Los 5 libros con más comentarios en Bookex</CardSubtitle>
            <CardText role="list">

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
  listaCalificaciones (publicaciones) {
    return publicaciones.map((n) => {
      return (
        <li key={n._id}>
          Nombre usuario: {n.username},
          Calificación: {Math.trunc(n.nota * 100) / 100
          /*evil hack to get a whole number or the fisrt 2 decimal digits*/}
        </li>
      );
    });
  }
  render () {
    return (
      <div>
        <div className="bookexLogo">
          <img src="/logoBookex2.png" height="300" alt="Logo Bookex"/>
        </div>
        <Row>
          <Col sm="3">
            <div className="help">
              <div className="helpLogo">
                <img src="/setup.png" height="80" alt="tuerca logo"/>
              </div>
              <h3 >Crea una cuenta</h3>
              <p>
                Puedes usar tu cuenta personal de Google o
                crea una en el formulario, solo introduce un nombre de usuario y una contraseña.
                Esta opción la encuentras en la barra de navegación en el botón SingIn.
              </p>
            </div>
          </Col>
          <Col sm="3">
            <div className="help">
              <div className="helpLogo">
                <img src="/search.png" height="80" alt="lupa buscar"/>
              </div>
              <h3 >Busca un libro</h3>
              <p>
                En tu menú en la barra de navegación puedes buscar un libro por título,
                autor o editorial. Ve las condiciones de los distintos libros que otros
                publicaron. Cuando veas una publicación de interés, inicia chat con el
                dueño para coordinar la transacción. Recuerda calificar al usuario al
                terminar.
              </p>
            </div>
          </Col>
          <Col sm="3">
            <div className="help">
              <div className="helpLogo">
                <img src="/pen.png" height="80" alt="Logo pen"/>
              </div>
              <h3 >Crea una publicación de tu libro</h3>
              <p>
                En tu menú en la barra de navegación puedes crear una publicación,
                busca si el libro que tienes ya esta registrado en el sistema esto agilizara el
                formulario. En el caso que no esté diligencia el formulario completamente.
              </p>
            </div>
          </Col>
          <Col sm="3">
            <div className="help">
              <div className="helpLogo">
                <img src="/msg.png" height="80" alt="Logo mensaje"/>
              </div>
              <h3 >Mensajes</h3>
              <p>
                En tu menú en la barra de navegación en la sección de mensajes, vas a ver
                tus hilos de conversaciones. Así coordinaras con las personas que están
                interesadas en alguno de tus libros o que son dueñas de un libro de tu interés.
              </p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col sm="12">
            <div className="help">
              <h1> Estadísticas </h1>
            </div>
          </Col>
        </Row>
        <Row>
          {this.usuarioNotaTop()}
          {this.usuarioNotaNoTop()}
          {this.publicacionesNotaTop()}
          {this.publicacionesComentarioTop()}
          {this.publicacionesValorTop()}
          {this.publicacionesValorNoTop()}
        </Row>
      </div>
    );
  }
}
//Props del Home
Stats.propTypes = {
  //Publicaciones
  publicaciones: PropTypes.array,
  calificaciones: PropTypes.array
};
