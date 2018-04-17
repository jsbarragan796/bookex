/* eslint-env mocha */
import { Meteor } from "meteor/meteor";
import { mount } from "enzyme";
import { expect } from "chai";
import ListaPublicaciones from "./listaPublicaciones.js";
import React from "react";
import faker from "faker";
import { Random } from "meteor/random";


if (Meteor.isServer) {
  import "jsdom-global/register";
}
describe("Publicaciones list", function () {
  let username1 = faker.name.findName();
  let userId = Random.id();
  let listaPublicaciones;
  beforeEach(function () {
    listaPublicaciones = mount(<ListaPublicaciones publicaciones={[]}
      usuario={{ _id: userId, username: username1 }}
      getNota={() => console.log("sdfsdf")}
      alert={() => console.log("sdfsdf")}
      publicacionExSelecionada={null}/>);
  });
  it("Render Publicaciones search form", function () {
    expect(listaPublicaciones.find("button.btn.btn-secondary")).to.have.length(1);
    expect(listaPublicaciones.find("div.form-group")).to.have.length(1);
  });
  it("Render Publicaciones search from input", function () {
    expect(listaPublicaciones.find("input")).to.have.length(1);
  });
  it("Render Publicaciones pagination", function () {
    expect(listaPublicaciones.find("ul.pagination")).to.have.length(1);
  });

});
