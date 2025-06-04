
# 📘 LocaleLoop – Full System Design Document

## 📌 Project Overview

**Project Name:** LocaleLoop  
**Type:** Fullstack Web App  
**Goal:** A collaborative platform for locals and travelers to create and browse curated city guides called “loops,” which are thematic collections of places (e.g., cafés, museums, parks) with rich descriptions, images, and map links.

---

## 🧱 Architecture Overview

### 1. **Frontend**
- **Framework:** Next.js 14+ (App Router)
- **Rendering:** Client-side for most pages, SSR for public loop pages
- **Styling:** Tailwind CSS + ShadCN UI
- **State Management:** React state + useOptimistic (for Server Actions)
- **Forms:** Server Actions + Zod validation

### 2. **Backend**
- **Platform:** Node.js (via Next.js API + Server Actions)
- **Database:** PostgreSQL (or SQLite for local dev)
- **ORM:** Prisma
- **Authentication:** Auth.js (NextAuth) with Email/Password or OAuth
- **Image Upload:** Cloudinary
- **Optional:** Redis (for caching search/tag results)

---

## 🔐 Authentication & Authorization

- **Users can:**
  - Register/login (OAuth or email)
  - Edit/delete their own loops and places
  - Comment or like public loops

- **Admin role can:**
  - Moderate content (flagged or reported)
  - Feature certain loops on the homepage

- **Unauthenticated users can:**
  - Browse loops and view loop pages
  - View author profiles

---

## 🗃️ Database Schema (Prisma)

\`\`\`prisma
model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  password      String?   // optional for OAuth
  image         String?
  loops         Loop[]    @relation("UserLoops")
  comments      Comment[]
  likes         Like[]
  role          Role      @default(USER)
  createdAt     DateTime  @default(now())
}

model Loop {
  id            String     @id @default(cuid())
  title         String
  slug          String     @unique
  description   String
  coverImage    String
  city          String
  tags          String[]
  user          User       @relation("UserLoops", fields: [userId], references: [id])
  userId        String
  places        Place[]
  comments      Comment[]
  likes         Like[]
  createdAt     DateTime   @default(now())
}

model Place {
  id          String   @id @default(cuid())
  name        String
  description String
  image       String?
  category    String   // e.g., "Food", "Museum"
  mapUrl      String
  loop        Loop     @relation(fields: [loopId], references: [id])
  loopId      String
  order       Int
}

model Comment {
  id        String   @id @default(cuid())
  content   String
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  loop      Loop     @relation(fields: [loopId], references: [id])
  loopId    String
  createdAt DateTime @default(now())
}

model Like {
  id      String @id @default(cuid())
  user    User   @relation(fields: [userId], references: [id])
  userId  String
  loop    Loop   @relation(fields: [loopId], references: [id])
  loopId  String
  @@unique([userId, loopId])
}

enum Role {
  USER
  ADMIN
}
\`\`\`

---

## 📤 Server Actions Plan

| Action                         | Path                       | Auth Required | Description                        |
|-------------------------------|----------------------------|---------------|------------------------------------|
| \`createLoop\`                  | \`/dashboard/new-loop\`      | ✅ Yes        | Create a new loop with details     |
| \`editLoop\`                    | \`/dashboard/edit/[id]\`     | ✅ Yes        | Edit loop title, tags, desc, image |
| \`deleteLoop\`                  | \`/dashboard/edit/[id]\`     | ✅ Yes        | Delete loop                        |
| \`addPlaceToLoop\`              | \`/dashboard/loop/[id]\`     | ✅ Yes        | Add a place to a loop              |
| \`reorderPlaces\`               | Client-side drag+drop      | ✅ Yes        | Change place order in a loop       |
| \`postComment\`                 | \`/loop/[slug]\`             | ✅ Yes        | Post comment on a loop             |
| \`likeLoop\`                    | \`/loop/[slug]\`             | ✅ Yes        | Like a loop                        |
| \`featureLoop (admin only)\`    | Admin panel                | ✅ Admin      | Mark loop as featured              |
| \`uploadImage\` (client helper) | Client-side + UploadThing  | ✅ Yes        | Upload loop/places images          |

---

## 🎨 UI Pages

| Route                        | Type        | Description                          |
|-----------------------------|-------------|--------------------------------------|
| \`/\`                         | Public SSR  | Featured & latest loops              |
| \`/explore\`                  | Public CSR  | Search, filter, tag browse           |
| \`/loop/[slug]\`              | Public SSR  | Public loop page with map            |
| \`/dashboard\`                | Private     | User dashboard with loop list        |
| \`/dashboard/new-loop\`       | Private     | Create new loop                      |
| \`/dashboard/edit/[id]\`      | Private     | Edit loop and its places             |
| \`/profile/[username]\`       | Public SSR  | Author’s public profile              |
| \`/admin\`                    | Admin-only  | Content moderation tools             |

---

## 🗺️ Maps Integration

- Optional integration with **Leaflet.js** or **Google Maps API**
- Places in a loop shown on a map in \`/loop/[slug]\`
- Links to Google Maps directions

---

## 📈 Future Enhancements

- Group collaboration (multiple contributors to a loop)
- Loop duplication/cloning
- Export loop to PDF
- PWA support for offline use
- Notifications for comments or likes
- Real-time chat/comments (WebSocket)

---

## 🔐 Security Considerations

- Use Server Actions to prevent direct form access (vs API endpoints)
- CSRF protection for all forms
- Rate limiting for actions like comments
- Admin moderation dashboard for reported content
- Hash passwords using bcrypt

---

## 🧪 Testing Strategy

- **Unit Tests** for Server Actions (e.g., Zod validation, ownership checks)
- **Integration Tests** for full user flow (create loop → add places → publish)
- **Playwright** or **Cypress** for E2E UI tests (optional)
- **Jest** for form/data logic

---

## 🚀 Deployment Stack

- **Platform:** Vercel (for frontend + edge Server Actions)
- **Database:** Railway or Supabase (PostgreSQL)
- **Image Hosting:** UploadThing or Cloudinary
- **Env Config:** \`.env.local\` for API keys, DB URL, etc.
