type InteractionPayload = Record<string, unknown> | undefined;

export const logInteraction = (eventName: string, payload?: InteractionPayload) => {
  if (!eventName) {
    return;
  }
};

export default logInteraction;
