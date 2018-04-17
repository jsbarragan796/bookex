/* eslint-env mocha */
import { mount } from "enzyme";
import { expect } from "chai";
import Stats from "./stats.js";
import React from "react";

if (Meteor.isServer) {
  import "jsdom-global/register";
}

describe("Stats", function () {
  it("Render cards", function () {
    const stats = mount(<Stats publicaciones={[]} calificaciones={[]}/>);
    expect(stats.find("button")).to.have.length(0);
    expect(stats.find("div.card")).to.have.length(6);
  });
  it("Render images", function () {
    const stats = mount(<Stats publicaciones={[]} calificaciones={[]}/>);
    expect(stats.find("img")).to.have.length(5);
  });
  it("Render guides test", function () {
    const stats = mount(<Stats publicaciones={[]} calificaciones={[]}/>);
    expect(stats.find("div.help > p")).to.have.length(4);
  });
});
