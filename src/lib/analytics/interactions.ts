type InteractionPayload = Record<string, unknown> | undefined;

export const logInteraction = (
  eventName: string,
  payload?: InteractionPayload
) => {
  if (!eventName) {
    return;
  }

  if (__DEV__) {
    const timestamp = new Date().toISOString();

    if (__DEV__)
      console.log(`[interaction:${eventName}]`, { payload, timestamp });
  }
};

export default logInteraction;
