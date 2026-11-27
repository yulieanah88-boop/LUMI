import {
  User,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../firebase';
import { ThemeConfig } from '../types';
import {
  getCustomThemes,
  markThemeSyncedToCloud,
  saveCustomTheme,
  unmarkThemeSyncedToCloud,
} from '../data/themes';

const CUSTOM_THEMES_COLLECTION = 'custom_themes';

let inFlightSyncPromise: Promise<number> | null = null;
let inFlightSyncUid: string | null = null;

function stripUndefinedDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => stripUndefinedDeep(item)) as unknown as T;
  }
  if (value !== null && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v !== undefined) {
        out[k] = stripUndefinedDeep(v);
      }
    }
    return out as T;
  }
  return value;
}

export function normalizeThemeId(rawId: string): string {
  const cleaned = rawId.replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, 128);
  return cleaned || `custom_${Date.now()}`;
}

function asString(val: unknown, fallback = ''): string {
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  return fallback;
}

function isPlainObject(val: unknown): val is Record<string, unknown> {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
}

export function sanitizeThemeForFirestore(theme: ThemeConfig, user: User) {
  const cleanId = normalizeThemeId(asString(theme.id) || `custom_${Date.now()}`);
  const safeJudul = (asString(theme.judulTema).trim() || 'Tema Pembelajaran').slice(0, 200);

  const rawTujuan = Array.isArray(theme.tujuanPembelajaran)
    ? theme.tujuanPembelajaran.filter(isPlainObject)
    : [];
  const safeTujuan =
    rawTujuan.length > 0
      ? rawTujuan.slice(0, 12)
      : [{ id: 1, text: `Memahami materi ${safeJudul}`.slice(0, 200), icon: '🎯' }];

  const rawBadges = Array.isArray(theme.badges)
    ? theme.badges.filter(isPlainObject)
    : [];
  const safeBadges =
    rawBadges.length > 0
      ? rawBadges.slice(0, 10)
      : [
          {
            id: `badge_${cleanId}_1`,
            section: 'belajar',
            title: `Penjelajah ${safeJudul}`.slice(0, 60),
            nickname: 'Pembelajar Tangguh',
            icon: '📖',
            color: 'from-emerald-500 to-teal-500',
            borderColor: 'border-emerald-300',
            bgGradient: 'bg-emerald-50',
            description: 'Menyelesaikan modul pembelajaran.',
            requirement: 'Selesaikan Menu Belajar.',
            quote: '"Belajar membuka jendela dunia!"',
          },
        ];

  const updatableFields = {
    judulTema: safeJudul,
    subJudul: asString(theme.subJudul).trim().slice(0, 300),
    mataPelajaran: (asString(theme.mataPelajaran).trim() || 'IPAS').slice(0, 150),
    fase: (asString(theme.fase).trim() || 'Fase B').slice(0, 60),
    kelas: (asString(theme.kelas).trim() || 'Kelas 3 SD').slice(0, 100),
    emojiMaskot: (Array.from(asString(theme.emojiMaskot).trim() || '🌟').slice(0, 4).join('') || '🌟').slice(0, 16),
    sapaanLumi: asString(theme.sapaanLumi).trim().slice(0, 1000),
    deskripsiSingkat: asString(theme.deskripsiSingkat).trim().slice(0, 500),
    capaianPembelajaran: asString(theme.capaianPembelajaran).trim().slice(0, 2000),
    palet: stripUndefinedDeep(isPlainObject(theme.palet) ? theme.palet : {}),
    tujuanPembelajaran: stripUndefinedDeep(safeTujuan),
    belajar: stripUndefinedDeep(isPlainObject(theme.belajar) ? theme.belajar : {}),
    bermain: stripUndefinedDeep(isPlainObject(theme.bermain) ? theme.bermain : {}),
    berlatih: stripUndefinedDeep(isPlainObject(theme.berlatih) ? theme.berlatih : {}),
    refleksi: stripUndefinedDeep(isPlainObject(theme.refleksi) ? theme.refleksi : {}),
    sumberBelajar: stripUndefinedDeep(
      (Array.isArray(theme.sumberBelajar) ? theme.sumberBelajar : [])
        .filter(isPlainObject)
        .slice(0, 20)
    ),
    glosarium: stripUndefinedDeep(
      (Array.isArray(theme.glosarium) ? theme.glosarium : [])
        .filter(isPlainObject)
        .slice(0, 50)
    ),
    sertifikat: stripUndefinedDeep(isPlainObject(theme.sertifikat) ? theme.sertifikat : {}),
    badges: stripUndefinedDeep(safeBadges),
    updatedAt: serverTimestamp(),
  };

  const payload = {
    id: cleanId,
    ...updatableFields,
    isCustom: true,
    isPublished: true,
    creatorUid: user.uid,
    creatorName: (asString(user.displayName).trim() || 'Guru MPI Lumi').slice(0, 120),
    createdAt: serverTimestamp(),
  };

  return { cleanId, payload, updatableFields };
}

export async function signInWithGooglePopup(): Promise<User> {
  googleProvider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOutGoogle(): Promise<void> {
  inFlightSyncPromise = null;
  inFlightSyncUid = null;
  await signOut(auth);
}

export async function saveCustomThemeToFirestore(
  theme: ThemeConfig,
  user: User,
  options?: { skipIfExists?: boolean; forceCreate?: boolean }
): Promise<ThemeConfig> {
  const { cleanId, payload, updatableFields } = sanitizeThemeForFirestore(theme, user);
  const path = `${CUSTOM_THEMES_COLLECTION}/${cleanId}`;
  const docRef = doc(db, CUSTOM_THEMES_COLLECTION, cleanId);

  let alreadyExists = false;
  if (!options?.forceCreate) {
    try {
      const existingSnap = await getDoc(docRef);
      alreadyExists = existingSnap.exists();
    } catch {
      alreadyExists = false;
    }
  }

  if (alreadyExists) {
    if (options?.skipIfExists) {
      markThemeSyncedToCloud(cleanId);
      return {
        ...theme,
        id: cleanId,
        isCustom: true,
        isPublished: true,
      };
    }

    try {
      await updateDoc(docRef, updatableFields);
      const updatedTheme: ThemeConfig = {
        ...theme,
        id: cleanId,
        isCustom: true,
        isPublished: true,
        creatorUid: user.uid,
        creatorName: payload.creatorName,
      };
      saveCustomTheme(updatedTheme);
      markThemeSyncedToCloud(cleanId);
      return updatedTheme;
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  }

  try {
    await setDoc(docRef, payload);
    const savedTheme: ThemeConfig = {
      ...theme,
      id: cleanId,
      isCustom: true,
      isPublished: true,
      creatorUid: user.uid,
      creatorName: payload.creatorName,
    };
    saveCustomTheme(savedTheme);
    markThemeSyncedToCloud(cleanId);
    return savedTheme;
  } catch (error) {
    // If document already existed (e.g., retry with forceCreate), try updating if owned by user
    try {
      const checkSnap = await getDoc(docRef);
      if (checkSnap.exists() && checkSnap.data()?.creatorUid === user.uid) {
        await updateDoc(docRef, updatableFields);
        const updatedTheme: ThemeConfig = {
          ...theme,
          id: cleanId,
          isCustom: true,
          isPublished: true,
          creatorUid: user.uid,
          creatorName: payload.creatorName,
        };
        saveCustomTheme(updatedTheme);
        markThemeSyncedToCloud(cleanId);
        return updatedTheme;
      }
    } catch {
      // Fall through to structured error reporting below
    }
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteCustomThemeFromFirestore(themeId: string): Promise<void> {
  const cleanId = normalizeThemeId(themeId);
  const path = `${CUSTOM_THEMES_COLLECTION}/${cleanId}`;
  try {
    await deleteDoc(doc(db, CUSTOM_THEMES_COLLECTION, cleanId));
    unmarkThemeSyncedToCloud(cleanId);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribePublishedCustomThemes(
  onUpdate: (themes: ThemeConfig[]) => void,
  onError?: (err: Error) => void
): () => void {
  const q = query(
    collection(db, CUSTOM_THEMES_COLLECTION),
    where('isPublished', '==', true)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items: Array<{ theme: ThemeConfig; ts: number }> = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as any;
        const createdMillis =
          typeof data.createdAt?.toMillis === 'function' ? data.createdAt.toMillis() : 0;
        const theme: ThemeConfig = {
          id: data.id || docSnap.id,
          judulTema: data.judulTema,
          subJudul: data.subJudul || '',
          mataPelajaran: data.mataPelajaran,
          fase: data.fase,
          kelas: data.kelas,
          emojiMaskot: data.emojiMaskot || '🌟',
          sapaanLumi: data.sapaanLumi || '',
          deskripsiSingkat: data.deskripsiSingkat || '',
          capaianPembelajaran: data.capaianPembelajaran || '',
          palet: data.palet,
          tujuanPembelajaran: data.tujuanPembelajaran || [],
          belajar: data.belajar,
          bermain: data.bermain,
          berlatih: data.berlatih,
          refleksi: data.refleksi,
          sumberBelajar: data.sumberBelajar || [],
          glosarium: data.glosarium || [],
          sertifikat: data.sertifikat,
          badges: data.badges || [],
          isCustom: true,
          isPublished: Boolean(data.isPublished),
          creatorUid: data.creatorUid,
          creatorName: data.creatorName,
        };
        items.push({ theme, ts: createdMillis });
      });

      items.sort((a, b) => b.ts - a.ts);
      onUpdate(items.map((item) => item.theme));
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, CUSTOM_THEMES_COLLECTION);
      } catch (wrapped) {
        if (onError) {
          onError(wrapped as Error);
        }
      }
    }
  );
}

export async function syncLocalThemesToFirestore(user: User): Promise<number> {
  if (inFlightSyncPromise && inFlightSyncUid === user.uid) {
    return inFlightSyncPromise;
  }

  inFlightSyncUid = user.uid;
  inFlightSyncPromise = (async () => {
    const localThemes = getCustomThemes();
    if (localThemes.length === 0) return 0;

    let existingIds = new Set<string>();
    try {
      const q = query(
        collection(db, CUSTOM_THEMES_COLLECTION),
        where('isPublished', '==', true)
      );
      const snap = await getDocs(q);
      existingIds = new Set(snap.docs.map((d) => d.id));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, CUSTOM_THEMES_COLLECTION);
    }

    let uploadedCount = 0;
    for (const localTheme of localThemes) {
      const cleanId = normalizeThemeId(localTheme.id);
      if (!existingIds.has(cleanId)) {
        await saveCustomThemeToFirestore(localTheme, user, { skipIfExists: true });
        existingIds.add(cleanId);
        uploadedCount += 1;
      } else {
        markThemeSyncedToCloud(cleanId);
      }
    }

    return uploadedCount;
  })();

  try {
    return await inFlightSyncPromise;
  } finally {
    inFlightSyncPromise = null;
    inFlightSyncUid = null;
  }
}
