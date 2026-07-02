type BackgroundTokenProvider = () => Promise<string | null>;

let tokenProvider: BackgroundTokenProvider | null = null;

export function setBackgroundSyncTokenProvider(
  provider: BackgroundTokenProvider | null
): void {
  tokenProvider = provider;
}

export async function getBackgroundSyncToken(): Promise<string | null> {
  if (!tokenProvider) return null;
  try {
    return await tokenProvider();
  } catch {
    return null;
  }
}
