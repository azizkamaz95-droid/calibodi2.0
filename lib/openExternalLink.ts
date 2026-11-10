// Opens external URLs natively on Capacitor (iOS/Android) since a plain
// <a target="_blank"> does not navigate inside a Capacitor WKWebView.
export async function openExternalLink(url: string) {
  try {
    const { Capacitor } = await import('@capacitor/core');
    if (Capacitor.isNativePlatform()) {
      const { Browser } = await import('@capacitor/browser');
      await Browser.open({ url });
      return;
    }
  } catch {}
  if (typeof window !== 'undefined') window.open(url, '_blank', 'noopener,noreferrer');
}
