/**
 * Générateur pseudo-aléatoire à graine : la même graine redonne toujours la même année.
 */
export function generateurAleatoire(graine = 2025) {
  let n = graine >>> 0;
  const t = () => {
    n = (n + 1831565813) >>> 0;
    let a = n;
    a = Math.imul(a ^ (a >>> 15), a | 1);
    a ^= a + Math.imul(a ^ (a >>> 7), a | 61);
    return ((a ^ (a >>> 14)) >>> 0) / 4294967296;
  };
  t.normal = (a = 0, c = 1) => {
    const o = Math.max(t(), 1e-9);
    const d = t();
    return a + c * Math.sqrt(Math.log(o) * -2) * Math.cos(Math.PI * 2 * d);
  };
  return t;
}
