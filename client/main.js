import React from "react";
import { Meteor } from "meteor/meteor";
import { render } from "react-dom";
// import { WebApp } from "meteor/webapp";

import App from "../imports/ui/App.js";
// WebApp.addHtmlAttributeHook(() => ({ lang: "en" }));
Meteor.startup(() => {
  $("html").attr("lang", "es");
  render(<App />, document.getElementById("render-target"));
});
