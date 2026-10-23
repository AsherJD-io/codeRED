/*
 * Browser tab titles, kept in one place so the mapping stays consistent.
 *
 * The homepage carries the brand title; each navigable section carries its own.
 * A section's title is applied when it becomes the active reading position, not
 * only on click, so a direct hash load, a refresh on a hash, and back/forward
 * navigation all land on the right title.
 */
export const HOME_TITLE = "codeRED | Delebayo Asher Portfolio";

export const SECTION_TITLES: Record<string, string> = {
  work: "codeRED | Work",
  experience: "codeRED | Experience",
  blogs: "codeRED | Blogs",
  about: "codeRED | About",
  skills: "codeRED | My stack",
  contact: "codeRED | Contact",
};

export function titleFor(section: string | null): string {
  if (!section) return HOME_TITLE;
  return SECTION_TITLES[section] ?? HOME_TITLE;
}
