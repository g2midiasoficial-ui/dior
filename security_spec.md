# Security Specification: Diorfy Workspace Firebase

## 1. Data Invariants

1. **User Profiles (`/users/{userId}`)**:
   - Only authenticated users can read or write their own profile document (`request.auth.uid == userId`).
   - Profile document IDs must match the user's authenticated UID.
   - Users cannot elevate their own role/plan to unauthorized tiers without explicit verification.

2. **Boards Collection (`/boards/{boardId}`)**:
   - Document ID must be a sanitized alphanumeric identifier (`isValidId(boardId)`).
   - The `ownerId` must match `request.auth.uid` upon creation and remain immutable on updates.
   - Only the owner or designated collaborators can read or update a board.
   - Deletion of a board is restricted strictly to the `ownerId`.
   - Board title must be a non-empty string under 200 characters.

3. **Templates (`/templates/{templateId}`)**:
   - Public read-only collection for all users (`allow read: if true`).
   - Creation/update restricted strictly to authenticated admin users.

## 2. The Dirty Dozen Attack Payloads (Must be Blocked by Rules)

1. **Attack 01 (Ghost Key Injection)**: Writing a board document containing `{ "isAdmin": true, "unboundedField": "..." }`.
2. **Attack 02 (Owner Spoofing on Create)**: Creating a board with `ownerId: "victim_uid"` instead of `request.auth.uid`.
3. **Attack 03 (Owner Hijacking on Update)**: Modifying existing board's `ownerId` from `author_uid` to `attacker_uid`.
4. **Attack 04 (Unauthorized Board Delete)**: Attempting to delete a board when `request.auth.uid != resource.data.ownerId`.
5. **Attack 05 (Unauthenticated Board Read/List)**: Querying private boards without an active session (`request.auth == null`).
6. **Attack 06 (Poisoned Board ID)**: Creating a board with a 2KB junk character ID violating `isValidId`.
7. **Attack 07 (PII Profile Harvest)**: Querying `/users/{victimId}` from another non-owner account.
8. **Attack 08 (Oversized Title Bomb)**: Injecting a 50,000 character string in `title`.
9. **Attack 09 (Template Tampering)**: Regular user attempting to write or delete documents in `/templates/`.
10. **Attack 10 (Type Poisoning)**: Setting `elements` to a boolean or integer instead of an array/map.
11. **Attack 11 (Shadow Field in Profile)**: Injecting system-level claims in user profile document.
12. **Attack 12 (Cross-Tenant Update)**: Updating another user's board by bypassing frontend filters.

## 3. Test Runner Invariants
All 12 dirty dozen attack vectors must return `PERMISSION_DENIED` under the generated `firestore.rules`.
