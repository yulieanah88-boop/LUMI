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

export function sanitizeThemeForFirestore(theme: ThemeConfig, user: User) {
  const cleanId = normalizeThemeId(theme.id || `custom_${Date.now()}`);
  const safeTujuan =
    Array.isArray(theme.tujuanPembelajaran) && theme.tujuanPembelajaran.length > 0
      ? theme.tujuanPembelajaran.slice(0, 12)
      : [{ id: 1, text: `Memahami materi ${theme.judulTema}`.slice(0, 200), icon: '🎯' }];
  const safeBadges =
    Array.isArray(theme.badges) && theme.badges.length > 0
      ? theme.badges.slice(0, 10)
      : [
          {
            id: `badge_${cleanId}_1`,
            section: 'belajar',
            title: `Penjelajah ${theme.judulTema}`.slice(0, 60),
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
    judulTema: ((theme.judulTema || '').trim() || 'Tema Pembelajaran').slice(0, 200),
    subJudul: (theme.subJudul || '').trim().slice(0, 300),
    mataPelajaran: ((theme.mataPelajaran || '').trim() || 'IPAS').slice(0, 150),
    fase: ((theme.fase || '').trim() || 'Fase B').slice(0, 60),
    kelas: ((theme.kelas || '').trim() || 'Kelas 3 SD').slice(0, 100),
    emojiMaskot: ((theme.emojiMaskot || '').trim() || '🌟').slice(0, 16),
    sapaanLumi: (theme.sapaanLumi || '').trim().slice(0, 1000),
    deskripsiSingkat: (theme.deskripsiSingkat || '').trim().slice(0, 500),
    capaianPembelajaran: (theme.capaianPembelajaran || '').trim().slice(0, 2000),
    palet: stripUndefinedDeep(theme.palet && typeof theme.palet === 'object' ? theme.palet : {}),
    tujuanPembelajaran: stripUndefinedDeep(safeTujuan.filter((x) => x && typeof x === 'object')),
    belajar: stripUndefinedDeep(theme.belajar && typeof theme.belajar === 'object' ? theme.belajar : {}),
    bermain: stripUndefinedDeep(theme.bermain && typeof theme.bermain === 'object' ? theme.bermain : {}),
    berlatih: stripUndefinedDeep(theme.berlatih && typeof theme.berlatih === 'object' ? theme.berlatih : {}),
    refleksi: stripUndefinedDeep(theme.refleksi && typeof theme.refleksi === 'object' ? theme.refleksi : {}),
    sumberBelajar: stripUndefinedDeep(
      (Array.isArray(theme.sumberBelajar) ? theme.sumberBelajar : [])
        .filter((x) => x && typeof x === 'object')
        .slice(0, 20)
    ),
    glosarium: stripUndefinedDeep(
      (Array.isArray(theme.glosarium) ? theme.glosarium : [])
        .filter((x) => x && typeof x === 'object')
        .slice(0, 50)
    ),
    sertifikat: stripUndefinedDeep(theme.sertifikat && typeof theme.sertifikat === 'object' ? theme.sertifikat : {}),
    badges: stripUndefinedDeep(safeBadges.filter((x) => x && typeof x === 'object')),
    updatedAt: serverTimestamp(),
  };

  const payload = {
    id: cleanId,
    ...updatableFields,
    isCustom: true,
    isPublished: true,
    creatorUid: user.uid,
    creatorName: (user.displayName || 'Guru MPI Lumi').trim().slice(0, 120),
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
  options?: { skipIfExists?: boolean }
): Promise<ThemeConfig> {
  const { cleanId, payload, updatableFields } = sanitizeThemeForFirestore(theme, user);
  const path = `${CUSTOM_THEMES_COLLECTION}/${cleanId}`;
  const docRef = doc(db, CUSTOM_THEMES_COLLECTION, cleanId);

  let alreadyExists = false;
  try {
    const existingSnap = await getDoc(docRef);
    alreadyExists = existingSnap.exists();
  } catch {
    // Doc might not exist or might be an unpublished doc owned by someone else;
    // proceed to create attempt below.
    alreadyExists = false;
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
