/* eslint-env mocha */
import { Meteor } from "meteor/meteor";
import { Publicaciones } from "./publicaciones.js";
import { Comentarios } from "./publicaciones.js";
import { assert } from "meteor/practicalmeteor:chai";
import { resetDatabase } from "meteor/xolvio:cleaner";
import { Random } from "meteor/random";
import faker from "faker";


if (Meteor.isServer) {
  describe("Books", function () {
    describe("Methods", function () {
      let ownerName = faker.name.findName();
      let userId = Random.id();
      let idPublicacion;
      beforeEach(function () {
        resetDatabase();
        idPublicacion = Publicaciones.insert({
          titulo: faker.lorem.words(),
          autores: faker.name.findName(),
          editorial: faker.company.companyName(),
          genero: faker.lorem.word(),
          edicion: faker.random.number().toString(),
          nota: 0,
          elementos: [{ estado: faker.lorem.word(), para: faker.lorem.word(),
            addedAt: new Date(), ownerId: userId, ownerName: ownerName }],
          comentarios: [] });
      });
      afterEach(function () {
        resetDatabase();
      });
      it("Create a book", function () {
        let book = { titulo: faker.lorem.words(),
          autores: faker.name.findName(),
          editorial: faker.company.companyName(),
          genero: faker.lorem.word(),
          edicion: faker.random.number().toString(),
          estado: faker.lorem.word(),
          para: faker.lorem.word() };

        const createBook = Meteor.server.method_handlers["publicacion.insert"];
        const invocation = { userId };
        createBook.apply(invocation, [book, ownerName]);
        assert.equal(Publicaciones.find().count(), 2);
      });
      it("Delete a book", function () {
        const deleleBook = Meteor.server.method_handlers["publicacion.remove"];
        const invocation = { userId };
        deleleBook.apply(invocation, [idPublicacion]);
        assert.equal(Publicaciones.find().count(), 0);
      });
      it("Add a element to a book", function () {
        let book = Publicaciones.findOne({ _id: idPublicacion });
        assert.equal(book._id, idPublicacion);
        let elementos = book.elementos;
        let ramdom = faker.random.number({
          min: 10,
          max: 50
        });
        for (var i = 0; i < ramdom; i++) {
          let newElemet = { estado: faker.lorem.word(), para: faker.lorem.word(),
            addedAt: new Date(), ownerId: userId, ownerName: ownerName };
          elementos.push(newElemet);
        }
        const addElementBook = Meteor.server.method_handlers["publicacion.update.elementos"];
        const invocation = { userId };
        addElementBook.apply(invocation, [idPublicacion, elementos]);
        book = Publicaciones.findOne({ _id: idPublicacion });
        assert.equal(book.elementos.length, elementos.length);
      });
    });
  });
  describe("Comments", function () {
    describe("Methods", function () {
      let ownerName = faker.name.findName();
      let userId = Random.id();
      let idPublicacion;
      beforeEach(function () {
        resetDatabase();
        idPublicacion = Publicaciones.insert({
          titulo: faker.lorem.words(),
          autores: faker.name.findName(),
          editorial: faker.company.companyName(),
          genero: faker.lorem.word(),
          edicion: faker.random.number().toString(),
          nota: 0,
          elementos: [{ estado: faker.lorem.word(), para: faker.lorem.word(),
            addedAt: new Date(), ownerId: userId, ownerName: ownerName }],
          comentarios: [] });
      });
      afterEach(function () {
        resetDatabase();
      });
      it("Add Comments", function () {
        let text = faker.lorem.sentence();
        const createComment = Meteor.server.method_handlers["comentario.insert"];
        const invocation = { userId };
        createComment.apply(invocation, [text, idPublicacion, ownerName]);
        assert.equal(Comentarios.find().count(), 1);
      });
      it("Add Comments to a book", function () {
        let book = Publicaciones.findOne({ _id: idPublicacion });
        assert.equal(book._id, idPublicacion);
        let comentarios = book.comentarios;
        let ramdom = faker.random.number({
          min: 10,
          max: 50
        });
        for (var i = 0; i < ramdom; i++) {
          let newElemet = { username: ownerName, texto: faker.lorem.sentence(),
            nota: faker.random.number(), addedAt: new Date() };
          comentarios.push(newElemet);
        }
        const addCommentstoABook = Meteor.server.method_handlers["comentario.update"];
        const invocation = { userId };
        addCommentstoABook.apply(invocation, [idPublicacion, comentarios, faker.random.number()]);
        book = Publicaciones.findOne({ _id: idPublicacion });
        assert.equal(book.comentarios.length, comentarios.length);
      });
    });
  });
}
