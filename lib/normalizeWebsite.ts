export function normalizeWebsite(input: string): string {
  let url = input.trim();

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }

  return url.replace(/\/$/, "");
}
