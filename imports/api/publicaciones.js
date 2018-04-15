import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";
import { DDPRateLimiter } from "meteor/ddp-rate-limiter";

export const Publicaciones = new Mongo.Collection("libros");
export const Comentarios = new Mongo.Collection("Comentarios");

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish("publicaciones", function () {
    return Publicaciones.find({});
  });
  Meteor.publish("comentarios", function () {
    return Comentarios.find({});
  });

  //limitador de solicitudes
  var requestLimit = 1;
  var requestTimeout = 10000;

  DDPRateLimiter.addRule({
    type: "method",
    name: "publicacion.insert"
  }, requestLimit, requestTimeout);
  DDPRateLimiter.addRule({
    type: "method",
    name: "comentario.insert"
  }, requestLimit, requestTimeout);
  DDPRateLimiter.addRule({
    type: "method",
    name: "comentario.update"
  }, requestLimit, requestTimeout);
  DDPRateLimiter.addRule({
    type: "method",
    name: "publicacion.update.elementos"
  }, requestLimit, requestTimeout);
  DDPRateLimiter.addRule({
    type: "method",
    name: "publicacion.remove"
  }, requestLimit, requestTimeout);
}


Meteor.methods({
  "publicacion.insert" (publicacion, ownerName) {
    check(publicacion, Object);
    check(ownerName, String);
    check(publicacion.titulo, String);
    check(publicacion.autores, String);
    check(publicacion.editorial, String);
    check(publicacion.genero, String);
    check(publicacion.edicion, String);
    check(publicacion.estado, String);
    check(publicacion.para, String);
    check(publicacion.autores, String);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    Publicaciones.insert({
      titulo: publicacion.titulo,
      autores: publicacion.autores,
      editorial: publicacion.editorial,
      genero: publicacion.genero,
      edicion: publicacion.edicion,
      nota: 0,
      elementos: [{ estado: publicacion.estado, para: publicacion.para,
        addedAt: new Date(), ownerId: this.userId, ownerName: ownerName }],
      comentarios: []
    });
  },
  "publicacion.update.elementos" (idPublicacion, elementos) {
    check(elementos, Array);
    for (var i = 0; i < elementos.length; i++) {
      check(elementos[i].estado, String);
      check(elementos[i].para, String);
      check(elementos[i].addedAt, Date);
      check(elementos[i].ownerId, String);
      check(elementos[i].ownerName, String);
    }
    check(idPublicacion, String);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    Publicaciones.update(idPublicacion, { $set: { elementos: elementos } });
  },
  "comentario.update" (idPublicacion, comentarios, nota) {
    check(comentarios, Array);
    check(idPublicacion, String);
    check(nota, Number);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    Publicaciones.update(idPublicacion, { $set: { nota: nota, comentarios: comentarios } });
  },
  "publicacion.remove" (idPublicacion) {
    check(idPublicacion, String);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    Publicaciones.remove(idPublicacion);
  },

  "comentario.insert" (text, idPublicacion, ownerName) {
    check(text, String);
    check(idPublicacion, String);
    check(ownerName, String);
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    Comentarios.insert({
      text,
      idPublicacion,
      ownerId: this.userId,
      ownerName: ownerName
    });
  }
});
