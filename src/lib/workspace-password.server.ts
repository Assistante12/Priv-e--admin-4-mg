/**
 * Hash / vérification du mot de passe d'un workspace (PBKDF2-SHA256, WebCrypto).
 * Le mot de passe en clair n'est jamais stocké.
 */
// Ne jamais dépasser 100 000 : certains runtimes WebCrypto rejettent au-delà.
const ITERATIONS = 100_000;
const LEGACY_ITERATIONS = 120_000;

function toHex(buf: ArrayBuffer) {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function derive(password: string, saltHex: string, iterations: number) {
  const enc = new TextEncoder();
  const salt = Uint8Array.from(saltHex.match(/.{1,2}/g) ?? [], (h) => parseInt(h, 16));
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, [
    "deriveBits",
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    key,
    256,
  );
  return toHex(bits);
}

export async function hashWorkspacePassword(password: string) {
  const salt = toHex(crypto.getRandomValues(new Uint8Array(16)).buffer);
  const hash = await derive(password, salt, ITERATIONS);
  return { salt, hash };
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function verifyWorkspacePassword(
  password: string,
  saltHex: string | null,
  hash: string | null,
) {
  if (!saltHex || !hash) return false;
  // Essaie d'abord les itérations actuelles, puis l'ancienne valeur (120 000)
  // pour les mots de passe créés avant la correction. Sur les runtimes qui
  // plafonnent à 100 000, la tentative legacy lève une erreur : on l'ignore.
  const candidates = [ITERATIONS, LEGACY_ITERATIONS];
  for (const iterations of candidates) {
    try {
      const computed = await derive(password, saltHex, iterations);
      if (safeEqual(computed, hash)) return true;
    } catch {
      // itérations non supportées par ce runtime — essayer la suivante
    }
  }
  return false;
}
