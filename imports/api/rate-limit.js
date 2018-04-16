import { DDPRateLimiter } from "meteor/ddp-rate-limiter";

DDPRateLimiter.setErrorMessage(({ timeToReset }) => {
  const time = Math.ceil(timeToReset / 1000);
  const seconds = time === 1 ? "segundo" : "segundos";
  return `Hemos recibido demasiadas solicitudes (¿no estarás saboteando la aplicación 👀?), espera
  ${time} ${seconds}.`;
});
