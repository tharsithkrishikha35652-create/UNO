import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export const CURRENT_APP_VERSION = '1.0.2';

export interface AppVersionConfig {
  minimumVersion: string;
  latestVersion: string;
  updateUrl: string;
  driveUrl?: string;
  releaseNotes?: string;
  maintenanceMode?: boolean;
  maintenanceMessage?: string;
}

/**
 * Compares two semantic version strings (e.g. "1.0.0" vs "1.1.0").
 * Returns true if current version is strictly older than minimum required version.
 */
export function isVersionOutdated(current: string, minimum: string): boolean {
  if (!minimum || typeof minimum !== 'string') return false;
  if (!current || typeof current !== 'string') return true;

  const parseParts = (v: string): number[] =>
    v
      .trim()
      .replace(/^v/i, '')
      .split('.')
      .map((part) => {
        const num = parseInt(part, 10);
        return Number.isFinite(num) ? num : 0;
      });

  const cParts = parseParts(current);
  const mParts = parseParts(minimum);
  const maxLen = Math.max(cParts.length, mParts.length);

  for (let i = 0; i < maxLen; i++) {
    const c = cParts[i] ?? 0;
    const m = mParts[i] ?? 0;
    if (c < m) return true;
    if (c > m) return false;
  }

  return false;
}

/**
 * Fetches the app version configuration from Cloud Firestore (`/app_config/version`).
 * Returns null if unconfigured or unreachable.
 */
export async function fetchAppVersionConfig(): Promise<AppVersionConfig | null> {
  if (!db) return null;
  try {
    const versionDocRef = doc(db, 'app_config', 'version');
    const snapshot = await getDoc(versionDocRef);
    if (!snapshot.exists()) {
      return null;
    }
    const data = snapshot.data();
    if (!data || typeof data.minimumVersion !== 'string') {
      return null;
    }
    const rawUpdateUrl =
      typeof data.updateUrl === 'string' && data.updateUrl.trim()
        ? data.updateUrl.trim()
        : '';
    const rawDriveUrl =
      typeof data.driveUrl === 'string' && data.driveUrl.trim()
        ? data.driveUrl.trim()
        : rawUpdateUrl.includes('drive.google.com')
        ? rawUpdateUrl
        : '';

    return {
      minimumVersion: String(data.minimumVersion).trim(),
      latestVersion: typeof data.latestVersion === 'string' ? data.latestVersion.trim() : String(data.minimumVersion).trim(),
      updateUrl:
        rawUpdateUrl ||
        rawDriveUrl ||
        'https://github.com/tharsithkrishikha35652-create/UNO/releases/latest',
      driveUrl: rawDriveUrl || undefined,
      releaseNotes: typeof data.releaseNotes === 'string' ? data.releaseNotes : undefined,
      maintenanceMode: Boolean(data.maintenanceMode),
      maintenanceMessage: typeof data.maintenanceMessage === 'string' ? data.maintenanceMessage : undefined,
    };
  } catch (error) {
    // If the check fails due to network outage or local environment, do not block offline calculations
    console.warn('Could not verify app version from Firestore:', error);
    return null;
  }
}

