type InteractionPayload = Record<string, unknown> | undefined;

export const logInteraction = (eventName: string, payload: InteractionPayload = undefined) => {
  if (!eventName || !__DEV__) {
    return;
  }

  const timestamp = new Date().toISOString();
  // eslint-disable-next-line no-console
  console.log(`[interaction:${eventName}]`, { payload, timestamp });
};

export default logInteraction;

