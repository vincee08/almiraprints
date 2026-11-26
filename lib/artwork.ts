export const MAX_ARTWORK_BYTES = 10 * 1024 * 1024;
export const ARTWORK_ACCEPT = ".pdf,.png,.jpg,.jpeg,.ai,.psd";
export const ARTWORK_FORMATS = "PDF, PNG, JPG, AI or PSD";

/** Shared by the picker and server; accept= alone does not validate a file. */
export function validateArtwork(file: Pick<File, "name" | "size">): string | null {
  if (file.size === 0) return "This file is empty. Please choose another file.";
  if (file.size > MAX_ARTWORK_BYTES) return "Artwork must be 10 MB or smaller.";
  if (!/\.(pdf|png|jpe?g|ai|psd)$/i.test(file.name)) return `Choose a ${ARTWORK_FORMATS} file.`;
  if (file.name.length > 200) return "Please shorten the file name to 200 characters or fewer.";
  return null;
}
