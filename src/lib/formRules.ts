/* Which characters each contact form field accepts.
   Used by the form (removes bad characters while typing) and by /api/contact (rejects them),
   so code like <script> can never be typed in or sent around the form. */

export type FieldName = "name" | "email" | "message" | "link";

// characters NOT allowed in each field
const blocked: Record<FieldName, RegExp> = {
  // letters (including ñ, é…), spaces, and . ' - only. Example: "Ma. Cristina O'Neil-Dela Cruz"
  name: /[^\p{L}\p{M} .'-]/gu,
  // letters, numbers and @ . _ - + only
  email: /[^A-Za-z0-9@._+-]/g,
  // normal writing is fine (letters, numbers, , . ! ? ( ) : ; " ' - @ # & % etc.),
  // but not the symbols used to write code: < > { } [ ] ` \ | ^ ~ $
  message: /[<>{}[\]`\\|^~$]/g,
  // normal web address characters only, no spaces, quotes or < >
  link: /[^A-Za-z0-9\-._~:/?#@!&+,;=%]/g,
};

export const fieldHint: Record<FieldName, string> = {
  name: "Name can only have letters, spaces and . ' -",
  email: "Email can only have letters, numbers and @ . _ - +",
  message: "These symbols are not allowed: < > { } [ ] ` \\ | ^ ~ $",
  link: "Link can't have spaces, quotes or < >",
};

/** Removes characters that aren't allowed. Returns the clean text and whether anything was removed. */
export function cleanField(field: FieldName, value: string) {
  const clean = value.replace(blocked[field], "");
  return { clean, changed: clean !== value };
}

/** True if the text only has allowed characters. */
export function isFieldClean(field: FieldName, value: string) {
  return !cleanField(field, value).changed;
}

// a normal email shape: something@something.domain
export const EMAIL_PATTERN = /^[A-Za-z0-9._+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
