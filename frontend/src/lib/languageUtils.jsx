import { LANGUAGE_TO_FLAG, LANGUAGE_TO_ICON } from "../constants";

/**
 * Returns flag image element or language icon based on language string
 * @param {string} language
 */
export function getLanguageIcon(language) {
  if (!language) return null;
  const langLower = language.toLowerCase();

  if (LANGUAGE_TO_FLAG[langLower]) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${LANGUAGE_TO_FLAG[langLower]}.png`}
        className="h-3 mr-1 inline-block rounded-xs"
        alt={language}
        loading="lazy"
      />
    );
  }

  if (LANGUAGE_TO_ICON[langLower]) {
    return (
      <img
        src={LANGUAGE_TO_ICON[langLower]}
        className="h-3.5 mr-1 inline-block"
        alt={language}
        loading="lazy"
      />
    );
  }

  return null;
}
