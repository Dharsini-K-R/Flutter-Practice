import { BroadcastChannel } from "broadcast-channel";

const broadcastChannel = new BroadcastChannel("CCLA");

const send = (message) => {
  broadcastChannel.postMessage(message);
};

const listen = (cb) => {
  broadcastChannel.addEventListener("message", (event) => {
    cb(event);
  });
};

export default {
  send,
  listen,
};
