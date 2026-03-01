// ══════════════════════════════════════════════════════════════════════════════
// 🔐 NextAuth Route Handler — /api/auth/[...nextauth]
// ══════════════════════════════════════════════════════════════════════════════

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
