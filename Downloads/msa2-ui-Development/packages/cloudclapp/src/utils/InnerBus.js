import EventEmitter from "events";

// List of all events available for usage with inner bus
const EVENTS = {
  LOGOUT: "LOGOUT",
  LOGIN: "LOGIN",
};

class InnerBus extends EventEmitter {
  evt = EVENTS;
}

export default new InnerBus();
