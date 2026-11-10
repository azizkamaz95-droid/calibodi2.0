// RevenueCat Capacitor — iOS + Android
// iOS key: appl_iIRvmHfqxtgfarKGbuRKBQuSaGz
// Android key: injected at runtime via platform detection

const RC_KEY_IOS = 'appl_iIRvmHfqxtgfarKGbuRKBQuSaGz';
const RC_KEY_ANDROID = 'goog_ejhehdnQDBXZokGXtDdnROcAaRw';

let initialized = false;

async function getPlatform(): Promise<'ios' | 'android' | 'web'> {
  try {
    const { Capacitor } = await import('@capacitor/core');
    const p = Capacitor.getPlatform();
    if (p === 'ios') return 'ios';
    if (p === 'android') return 'android';
  } catch {}
  return 'web';
}

export async function initRevenueCat(): Promise<void> {
  if (initialized) return;
  const platform = await getPlatform();
  if (platform === 'web') return;

  try {
    const { Purchases, LOG_LEVEL } = await import('@revenuecat/purchases-capacitor');
    const apiKey = platform === 'ios' ? RC_KEY_IOS : RC_KEY_ANDROID;
    await Purchases.setLogLevel({ level: LOG_LEVEL.ERROR });
    await Purchases.configure({ apiKey });
    initialized = true;
  } catch (e) {
    console.error('[RevenueCat] Init error', e);
  }
}

export async function checkSubscriptionStatus(): Promise<boolean> {
  const platform = await getPlatform();
  if (platform === 'web') return false;
  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor');
    const { customerInfo } = await Purchases.getCustomerInfo();
    return Object.keys(customerInfo.entitlements.active).length > 0;
  } catch {
    return false;
  }
}

export interface RCPackage {
  identifier: string;        // package identifier ($rc_monthly, annual once, …)
  productIdentifier: string; // store product identifier (calibodi_monthly, …)
  product: {
    priceString: string;
    localizedTitle: string;
    localizedDescription: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _raw: any;
}

export async function getOfferings(): Promise<RCPackage[]> {
  const platform = await getPlatform();
  if (platform === 'web') return [];
  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor');
    const offerings = await Purchases.getOfferings();
    const current = offerings.current;
    if (!current) return [];
    return current.availablePackages.map((pkg) => ({
      identifier: pkg.identifier,
      productIdentifier: pkg.product.identifier,
      product: {
        priceString: pkg.product.priceString,
        localizedTitle: pkg.product.title,
        localizedDescription: pkg.product.description,
      },
      _raw: pkg,
    }));
  } catch {
    return [];
  }
}

export async function purchasePackage(pkg: RCPackage): Promise<{ success: boolean; error?: string }> {
  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor');
    const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg._raw });
    const active = Object.keys(customerInfo.entitlements.active).length > 0;
    return { success: active };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    // User cancelled — not an error to show
    if (msg.includes('cancel') || msg.includes('Cancel') || msg.includes('userCancelled')) {
      return { success: false };
    }
    return { success: false, error: msg };
  }
}

export async function restorePurchases(): Promise<boolean> {
  try {
    const { Purchases } = await import('@revenuecat/purchases-capacitor');
    const { customerInfo } = await Purchases.restorePurchases();
    return Object.keys(customerInfo.entitlements.active).length > 0;
  } catch {
    return false;
  }
}
