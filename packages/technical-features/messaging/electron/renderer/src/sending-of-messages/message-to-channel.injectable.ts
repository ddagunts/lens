import { getInjectable } from "@ogre-tools/injectable";
import sendToIpcInjectable from "./send-to-ipc.injectable";
import { SendMessageToChannel, sendMessageToChannelInjectionToken } from "@openlens/messaging";

const messageToChannelInjectable = getInjectable({
  id: "message-to-channel",

  instantiate: (di) => {
    const sendToIpc = di.inject(sendToIpcInjectable);

    return ((channel, message) => {
      sendToIpc(channel.id, message);
    }) as SendMessageToChannel;
  },

  injectionToken: sendMessageToChannelInjectionToken,
});

export default messageToChannelInjectable;
