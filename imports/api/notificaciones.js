import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Notificaciones = new Mongo.Collection("notificaciones");

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish("notificaciones", function notiPublication () {
    return Notificaciones.find({});
  });
}


Meteor.methods({
  "noti.insert" (text) {
    check(text, String);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    Notificaciones.insert({
      text,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username
    });
  }
});
