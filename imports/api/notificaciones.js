import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";
export const Notificaciones = new Mongo.Collection("notificaciones");
export const Chats = new Mongo.Collection("chats");

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
  Meteor.publish("chats", function chatPublication () {
    return Chats.find({
      $or: [
        { ownerId2: this.userId },
        { ownerId1: this.userId }
      ]
    });
  });
}


Meteor.methods({
  "noti.insert" (text, ownerId2, chatId, username2) {
    check(text, String);
    check(ownerId2, String);
    check(chatId, String);
    check(username2, String);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }

    Notificaciones.insert({
      chatId,
      text,
      ownerId2,
      createdAt: new Date(),
      ownerId1: this.userId,
      username1: Meteor.users.findOne(this.userId).username,
      username2: username2
    });
  },

  "chat.insert" (ownerId2) {
    check(ownerId2, String);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    Chats.insert({
      ownerId2,
      ownerId1: this.userId,
      username1: Meteor.users.findOne({ _id: this.userId }).username,
      username2: Meteor.users.findOne({ _id: ownerId2 }).username
    });
  }
});
