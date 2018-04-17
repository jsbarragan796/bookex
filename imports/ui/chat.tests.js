/* eslint-env mocha */
import { Meteor } from "meteor/meteor";
import { mount } from "enzyme";
import { expect } from "chai";
import Chat from "./chat.js";
import React from "react";
import faker from "faker";
import { Random } from "meteor/random";


if (Meteor.isServer) {
  import "jsdom-global/register";
}
describe("Chats", function () {
  let username1 = faker.name.findName();
  let userId = Random.id();
  let chat;
  beforeEach(function () {
    chat = mount(<Chat salirChat={() => console.log("sdfsdf")} usuario={{ _id: userId, username: username1 }}
      chatSeleccionado={null}
      mensajes= {[]} calificaciones={[]}
      calificacion={""}
      nombreChat={"null"}/>);
  });
  it("Render no Chats", function () {
    expect(chat.find("div")).to.have.length(4);
  });

});
