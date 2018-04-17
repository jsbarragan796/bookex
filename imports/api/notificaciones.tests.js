/* eslint-env mocha */
import { Meteor } from "meteor/meteor";
import { Notificaciones } from "./notificaciones.js";
import { Calificaciones } from "./notificaciones.js";
import { Chats } from "./notificaciones.js";
import { assert } from "meteor/practicalmeteor:chai";
import { resetDatabase } from "meteor/xolvio:cleaner";
import { Random } from "meteor/random";
import { sinon } from "meteor/practicalmeteor:sinon";
import faker from "faker";
import { Factory } from "meteor/dburles:factory";


if (Meteor.isServer) {
  describe("Chats", function () {
    describe("Methods", function () {
      let currentUser;
      let username1 = faker.name.findName();
      let userId = Random.id();
      let username2 = faker.name.findName();
      let ownerId2 = Random.id();
      let chatId;
      beforeEach(function () {
        resetDatabase();
        Factory.define("user", Meteor.users, {
          _id: userId,
          userId: userId,
          username: username1
        });
        currentUser = Factory.create("user");
        sinon.stub(Meteor, "user");
        Meteor.user.returns(currentUser);
        chatId = Chats.insert({
          ownerId2,
          ownerId1: userId,
          username1: username1,
          username2: username2
        });
      });
      afterEach(function () {
        Meteor.user.restore();
        resetDatabase();
      });
      it("Create a chat", function () {
        let username3 = faker.name.findName();
        let ownerId3 = Random.id();
        const createChat = Meteor.server.method_handlers["chat.insert"];
        const invocation = { userId };
        createChat.apply(invocation, [ownerId3, username3, username1]);
        assert.equal(Chats.find().count(), 2);
      });
      it("Do not create a chat when users already have one", function () {
        const createChat = Meteor.server.method_handlers["chat.insert"];
        const invocation = { userId };
        createChat.apply(invocation, [ownerId2, username2, username1]);
        assert.equal(Chats.find().count(), 1);
      });
      it("Delete a chat", function () {
        chatId = Chats.insert({
          ownerId2,
          ownerId1: this.userId,
          username1: username1,
          username2: username2
        });
        const deleteChat = Meteor.server.method_handlers["chat.remove"];
        const invocation = { userId };
        deleteChat.apply(invocation, [chatId]);
        assert.equal(Chats.find().count(), 1);
      });
      it("Send a valid message", function () {
        let text = faker.lorem.sentence();
        const sendMsg = Meteor.server.method_handlers["noti.insert"];
        const invocation = { userId };
        sendMsg.apply(invocation, [text, ownerId2, chatId, username2, username1]);
        assert.equal(Notificaciones.find().count(), 1);
      });
      it("Do not save a empty message", function () {
        let text = "";
        const sendMsg = Meteor.server.method_handlers["noti.insert"];
        const invocation = { userId };
        sendMsg.apply(invocation, [text, ownerId2, chatId, username2, username1]);
        assert.equal(Notificaciones.find().count(), 0);
      });
    });
  });
  describe("Users scores", function () {
    describe("Methods", function () {
      let currentUser;
      let username1 = faker.name.findName();
      let userId = Random.id();
      let ownerId2 = Random.id();
      beforeEach(function () {
        resetDatabase();
        Factory.define("user", Meteor.users, {
          _id: userId,
          userId: userId,
          username: username1
        });
        currentUser = Factory.create("user");
        sinon.stub(Meteor, "user");
        Meteor.user.returns(currentUser);
      });
      afterEach(function () {
        Meteor.user.restore();
        resetDatabase();
      });
      it("Succesully scored a user", function () {
        let nota = 5;
        let cantidad = 3;
        const scores = Meteor.server.method_handlers["add.calificacion"];
        const invocation = { userId };
        scores.apply(invocation, [username1, ownerId2, nota, cantidad]);
        assert.equal(Calificaciones.find().count(), 1);
      });
    });
  });
}
