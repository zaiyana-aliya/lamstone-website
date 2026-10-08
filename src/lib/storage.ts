/**
 * Extract the object path from a Supabase storage URL or path.
 * Handles:
 * - Public URLs: https://.../storage/v1/object/public/{bucket}/{path}
 * - Signed URLs: https://.../storage/v1/object/sign/{bucket}/{path}?token=...
 * - Prefixed paths: {bucket}/{path}
 * - Raw object paths: {path}
 */
export function extractStoragePath(urlOrPath: string, bucket = "resumes"): string {
  if (!urlOrPath) return "";
  if (urlOrPath.includes(`/${bucket}/`)) {
    return urlOrPath.split(`/${bucket}/`)[1]?.split("?")[0] ?? urlOrPath;
  }
  if (urlOrPath.startsWith(`${bucket}/`)) {
    return urlOrPath.slice(bucket.length + 1);
  }
  return urlOrPath;
}
