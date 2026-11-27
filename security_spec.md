# Firestore Security Specification (Phase 0)

## 1. Data Invariants
1. Every document in `custom_themes/{themeId}` MUST have a valid `id` matching `{themeId}` and matching `^[a-zA-Z0-9_\-]+$` (max 128 chars).
2. A `CustomTheme` can only be created by an authenticated user with a verified email (`request.auth.token.email_verified == true`), and `creatorUid` MUST equal `request.auth.uid`.
3. `createdAt` MUST equal `request.time` on creation and remain immutable on updates; `updatedAt` MUST equal `request.time` on both creation and updates.
4. Only the theme creator (`existing().creatorUid == request.auth.uid`) or a verified admin can update or delete a `CustomTheme`.
5. `allow list` on `custom_themes` MUST enforce `resource.data.isPublished == true` (or `creatorUid == request.auth.uid` for verified users) without any `get()`/`exists()` calls.
6. No PII (`email`, `phone`, `address`) is stored in `custom_themes`.
7. All strings and arrays have explicit `.size()` bounds; unknown/shadow fields are rejected via `hasAll` and `hasOnly`.

## 2. The "Dirty Dozen" Attack Payloads (Expected: PERMISSION_DENIED)
1. **Unauthenticated Create**: Creating `/custom_themes/theme_1` with `auth == null`.
2. **Unverified Email Create**: Creating `/custom_themes/theme_1` with `email_verified: false`.
3. **UID Spoofing**: Authenticated user `uid_A` creates `/custom_themes/theme_1` with `creatorUid: "uid_B"`.
4. **Path/ID Mismatch**: Creating `/custom_themes/theme_1` with `data.id: "theme_2"`.
5. **ID Poisoning**: Creating `/custom_themes/bad$id` or 300-character document ID.
6. **Shadow Field Injection**: Creating a theme with an extra ghost field `isVerified: true`.
7. **Client Timestamp Forgery**: Creating a theme with a hardcoded past `createdAt` instead of `request.time`.
8. **Cross-Owner Update**: User `uid_B` attempts to update `custom_themes/theme_A` owned by `uid_A`.
9. **Immutable Creator Tampering**: Owner `uid_A` attempts to change `creatorUid` or `createdAt` during update.
10. **Oversized String DoS**: Updating `judulTema` with a 5,000-character string (> 200 max).
11. **Unbounded Array Injection**: Injecting 50 items into `tujuanPembelajaran` (> 12 max) or empty `badges`.
12. **Unpublished Draft Scraping**: User `uid_B` runs `getDocs` / `list` on `custom_themes` without `where('isPublished', '==', true)` to read `uid_A`'s unpublished draft (`isPublished: false`).
