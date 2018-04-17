/* eslint-env mocha */
import { Meteor } from "meteor/meteor";
import { mount } from "enzyme";
import { expect } from "chai";
import Home from "./home.js";
import React from "react";
import faker from "faker";
import { Random } from "meteor/random";


if (Meteor.isServer) {
  import "jsdom-global/register";
}
describe("Home", function () {
  let username1 = faker.name.findName();
  let userId = Random.id();
  let home;
  beforeEach(function () {
    home = mount(<Home salirChat={this.desSeleccionarChat} usuario={{ _id: userId, username: username1 }}
      chatSeleccionado={null}
      mensajes= {[]} notificaciones={[]}
      chats = {[]} seleccionarChat={() => console.log("sdfsdf")}
      desSeleccionarChat={() => console.log("sdfsdf")}
      publicaciones={[]} calificaciones={[]}/>);
  });
  it("Render Tab menu", function () {
    expect(home.find("li.nav-item")).to.have.length(3);
  });
  it("Render Publicaciones Component search form", function () {
    expect(home.find("div.form-group")).to.have.length(1);
  });
  it("Render Publicaciones Component search from input", function () {
    expect(home.find("input")).to.have.length(1);
  });
  it("Render Publicaciones Component pagination", function () {
    expect(home.find("ul.pagination")).to.have.length(1);
  });
  it("Render Publicacion Component", function () {
    expect(home.find("button.btn.btn-primary")).to.have.length(1);
  });
  it("Render Chat Component", function () {
    expect(home.find("div.col-sm-12>h1")).to.have.length(1);
  });
});
