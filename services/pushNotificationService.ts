// Push Notification Service — Capacitor LocalNotifications
// These are REAL notifications that appear even when the phone is asleep/locked.
// They use the Android notification system, not web notifications.

interface NotifPrefs {
  hydration: boolean;
  nutrition: boolean;
  sleep: boolean;
  training: boolean;
  motivation: boolean;
  sleepTime: string;  // "22:30"
}

let permissionGranted = false;

export async function requestPermissions(): Promise<boolean> {
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const result = await LocalNotifications.requestPermissions();
    permissionGranted = result.display === 'granted';
    return permissionGranted;
  } catch {
    console.log('Notifications not available (web mode)');
    return false;
  }
}

export async function cancelAll() {
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel({
        notifications: pending.notifications.map(n => ({ id: n.id })),
      });
    }
  } catch {}
}

// Schedule a single notification
async function schedule(id: number, title: string, body: string, at: Date) {
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    await LocalNotifications.schedule({
      notifications: [{
        id,
        title,
        body,
        schedule: { at, allowWhileIdle: true },  // allowWhileIdle = works in Doze mode
        sound: undefined,
        smallIcon: 'ic_stat_icon',
        largeIcon: 'ic_launcher',
      }],
    });
  } catch {}
}

// ─── Schedule all daily notifications based on user preferences ───
export async function scheduleDailyNotifications(prefs: NotifPrefs, userName: string) {
  await cancelAll();
  const granted = await requestPermissions();
  if (!granted) return;

  const today = new Date();
  let idCounter = 1000;

  // ── HYDRATION REMINDERS ──
  if (prefs.hydration) {
    const hydrationTimes = [9, 11, 13, 15, 17, 19];
    const hydrationMessages = [
      `☀️ Bonjour ${userName} ! Commence ta journée avec un grand verre d'eau.`,
      `💧 Petit rappel hydratation — ton corps te remerciera.`,
      `💧 Pause eau ! Continue à boire régulièrement.`,
      `💧 Tu as bu suffisamment ? Un verre d'eau maintenant.`,
      `💧 L'après-midi avance, pense à t'hydrater.`,
      `💧 Dernier rappel eau de la journée.`,
    ];
    for (let i = 0; i < hydrationTimes.length; i++) {
      const at = new Date(today);
      at.setHours(hydrationTimes[i], 0, 0, 0);
      if (at > today) {
        await schedule(idCounter++, 'CaliBodi — Hydratation', hydrationMessages[i], at);
      }
    }
  }

  // ── NUTRITION REMINDERS ──
  if (prefs.nutrition) {
    // Breakfast reminder
    const breakfast = new Date(today);
    breakfast.setHours(8, 0, 0, 0);
    if (breakfast > today) {
      await schedule(idCounter++, 'CaliBodi — Petit-déjeuner', `🍳 ${userName}, n'oublie pas de logger ton petit-déj pour un suivi précis.`, breakfast);
    }
    // Lunch
    const lunch = new Date(today);
    lunch.setHours(12, 30, 0, 0);
    if (lunch > today) {
      await schedule(idCounter++, 'CaliBodi — Déjeuner', '🥗 C\'est l\'heure du déj ! Pense à logger ton repas.', lunch);
    }
    // Dinner
    const dinner = new Date(today);
    dinner.setHours(19, 30, 0, 0);
    if (dinner > today) {
      await schedule(idCounter++, 'CaliBodi — Dîner', '🍽️ Ton dîner est-il équilibré ? Logue-le pour rester sur la bonne voie.', dinner);
    }
  }

  // ── SLEEP REMINDER ──
  if (prefs.sleep && prefs.sleepTime) {
    const [h, m] = prefs.sleepTime.split(':').map(Number);
    // Reminder 30 min before bedtime
    const sleepReminder = new Date(today);
    sleepReminder.setHours(h, m - 30, 0, 0);
    if (sleepReminder.getMinutes() < 0) {
      sleepReminder.setHours(h - 1, 30 + sleepReminder.getMinutes(), 0, 0);
    }
    if (sleepReminder > today) {
      await schedule(idCounter++, 'CaliBodi — Sommeil', `🌙 ${userName}, prépare-toi pour dormir. Réduis les écrans et détends-toi. Bonne nuit !`, sleepReminder);
    }
  }

  // ── TRAINING REMINDER ──
  if (prefs.training) {
    const training = new Date(today);
    training.setHours(17, 0, 0, 0);
    if (training > today) {
      await schedule(idCounter++, 'CaliBodi — Entraînement', `💪 ${userName}, ta séance t'attend ! Même 15 minutes font la différence.`, training);
    }
  }

  // ── MOTIVATION ──
  if (prefs.motivation) {
    const motivation = new Date(today);
    motivation.setHours(10, 0, 0, 0);
    if (motivation > today) {
      const msgs = [
        'Chaque jour compte. Tu es sur la bonne voie !',
        'Ton futur toi te remercie pour l\'effort d\'aujourd\'hui.',
        'La régularité bat l\'intensité. Continue !',
        'Un pas de plus vers ton objectif. Go !',
      ];
      const msg = msgs[today.getDay() % msgs.length];
      await schedule(idCounter++, 'CaliBodi — Motivation', `🔥 ${msg}`, motivation);
    }
  }
}

// ─── Schedule post-session water reminder ───
export async function schedulePostSessionReminder() {
  try {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const at = new Date(Date.now() + 30 * 60 * 1000); // 30 min later
    await LocalNotifications.schedule({
      notifications: [{
        id: 9999,
        title: 'CaliBodi — Hydratation post-séance',
        body: '💧 Tu as terminé une séance ! Pense à boire 500ml d\'eau pour bien récupérer.',
        schedule: { at, allowWhileIdle: true },
        smallIcon: 'ic_stat_icon',
      }],
    });
  } catch {}
}
