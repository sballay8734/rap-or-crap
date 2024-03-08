export function formatNameFirstLastName(string: string): string {
  const trimmed = string.trim();
  const parts = trimmed.split(" ");

  if (parts.length === 1) {
    return parts[0].slice(0, 1).toLocaleUpperCase() + parts[0].slice(1);
  } else if (parts.length === 2) {
    const [firstName, lastName] = parts;
    return `${firstName.slice(0, 1).toLocaleUpperCase()}${firstName.slice(1)} ${lastName.slice(0, 1).toLocaleUpperCase()}${lastName.slice(1)}`;
  } else {
    return trimmed;
  }
}
