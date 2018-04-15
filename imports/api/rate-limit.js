import { DDPRateLimiter } from "meteor/ddp-rate-limiter";

DDPRateLimiter.setErrorMessage(
  (tiempo) => {
    const time = Math.ceil(tiempo / 1000);
    const seconds = time === 1 ? "segundo" : "segundos";
    return "Calmado hemos recibido demasiadas solicitudes, espera " + time + " " + seconds;
  }
);
