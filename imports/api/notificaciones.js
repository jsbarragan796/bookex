import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";
import { DDPRateLimiter } from "meteor/ddp-rate-limiter";

export const Notificaciones = new Mongo.Collection("notificaciones");
export const Chats = new Mongo.Collection("chats");
export const Calificaciones = new Mongo.Collection("calificaciones");

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish("notificaciones", function notificaciones () {
    return Notificaciones.find({
      $or: [
        { ownerId2: this.userId },
        { ownerId1: this.userId }
      ]
    });
  });
  Meteor.publish("calificaciones", function notificaciones () {
    return Calificaciones.find({});
  });
  Meteor.publish("chats", function chatPublication () {
    return Chats.find({
      $or: [
        { ownerId2: this.userId },
        { ownerId1: this.userId }
      ]
    });
  });
  //limitador de solicitudes
  var requestLimit = 1;
  var requestTimeout = 2000;

  DDPRateLimiter.addRule({
    type: "method",
    name: "noti.insert"
  }, 5, 2000);
  DDPRateLimiter.addRule({
    type: "method",
    name: "add.calificacion"
  }, requestLimit, requestTimeout);
}


Meteor.methods({
  "noti.insert" (text, ownerId2, chatId, username2, username1) {
    // Only logged in users can use this method
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }

    // Validate the inputs of the method
    check(text, String);
    check(ownerId2, String);
    check(chatId, String);
    check(username2, String);
    check(username1, String);

    //trims the message just in case
    text = text.trim();

    // Only insert messages if the text is not empty
    if (text !== "") {
      Notificaciones.insert({
        chatId,
        text,
        ownerId2,
        createdAt: new Date(),
        ownerId1: this.userId,
        username1: username1,
        username2: username2
      });
    }
  },
  "chat.remove" (idChat) {
    check(idChat, String);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    Notificaciones.remove({ chatId: idChat });
    Chats.remove(idChat);
  },
  "add.calificacion" (username, idUsurio2, nota, cantidad) {
    check(idUsurio2, String);
    check(username, String);
    check(nota, Number);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    let obj = { username: username, idUser: idUsurio2, nota: nota, cantidad: cantidad };
    // Publicaciones.update(idPublicacion, { $set: { nota: nota, comentarios: comentarios } });
    Calificaciones.update({ idUser: idUsurio2 }, obj, { upsert: true });
  },


  "chat.insert" (ownerId2, username2, username1) {
    check(username1, String);
    check(ownerId2, String);
    check(username2, String);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    let a = Chats.findOne({
      $or: [
        { ownerId1: this.userId, ownerId2: ownerId2 },
        { ownerId2: this.userId, ownerId1: ownerId2 }
      ]
    });

    if (typeof a === "undefined" || a === null) {
      Chats.insert({
        ownerId2,
        ownerId1: this.userId,
        username1: username1,
        username2: username2
      });
    }
  }
});
