/* eslint-env mocha */
import { Meteor } from "meteor/meteor";
import { mount } from "enzyme";
import { expect } from "chai";
import Publicacion from "./publicacion.js";
import React from "react";
import faker from "faker";
import { Random } from "meteor/random";


if (Meteor.isServer) {
  import "jsdom-global/register";
}

describe("Publicacion", function () {
  let username1 = faker.name.findName();
  let userId = Random.id();
  let controls;
  beforeEach(function () {
    controls = mount(<Publicacion publicaciones={{}}
      usuario={{ _id: userId, username: username1 }}
      getNota={() => console.log("sdfsdf")}
      publicacionExistente={{}}
      quitarPublicacion ={() => console.log("sdfsdf")}/>);
  });
  it("Render Publicacion", function () {
    expect(controls.find("button.btn.btn-primary")).to.have.length(1);
  });
  it("Render Publicacion form", function () {
    controls.find('button.btn.btn-primary').simulate('click');
    expect(controls.find("form")).to.have.length(1);
    expect(controls.find("button.btn.btn-primary")).to.have.length(1);
    expect(controls.find("button.btn.btn-danger")).to.have.length(1);
  });
  it("Render Publicacion form fields", function () {
    controls.find('button.btn.btn-primary').simulate('click');
    expect(controls.find("input")).to.have.length(3);
    expect(controls.find("select")).to.have.length(4);
  });
});
