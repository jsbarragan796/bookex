import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";

export default class App extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <div>Hola mundo!!!! :D</div>
    );
  }
}


// export default withTracker(()=>{
//     // Meteor.subscribe("algo");
//     return{
//         //las subscripciones.
//     }
// })(App);
