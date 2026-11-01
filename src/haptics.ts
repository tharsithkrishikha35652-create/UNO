import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

/** No-op outside a native shell; feedback is reserved for meaningful user actions. */
export function acknowledgeInteraction() {
  if (!Capacitor.isNativePlatform()) return;
  void Haptics.impact({ style: ImpactStyle.Light }).catch(() => undefined);
}

export function acknowledgeNavigation() {
  if (!Capacitor.isNativePlatform()) return;
  void Haptics.impact({ style: ImpactStyle.Light }).catch(() => undefined);
}

export function acknowledgeSelection() {
  if (!Capacitor.isNativePlatform()) return;
  void Haptics.impact({ style: ImpactStyle.Light }).catch(() => undefined);
}

export function acknowledgeCompletion() {
  if (!Capacitor.isNativePlatform()) return;
  void Haptics.impact({ style: ImpactStyle.Medium }).catch(() => undefined);
}

export function acknowledgeSuccess() {
  if (!Capacitor.isNativePlatform()) return;
  void Haptics.notification({ type: NotificationType.Success }).catch(() => undefined);
}
