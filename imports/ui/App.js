import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import "bootstrap/dist/css/bootstrap.css";
import { Jumbotron } from "reactstrap";

 class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Jumbotron>
        <h1>Hola mundo!!!! :D</h1>
      </Jumbotron>
    );
  }
}


export default withTracker(()=>{
    // Meteor.subscribe("algo");
    return{
        //las subscripciones.
    }
})(App);