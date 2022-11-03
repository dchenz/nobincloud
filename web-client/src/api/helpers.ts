export async function jsonFetch(url: RequestInfo | URL, options?: RequestInit) {
  const response = await fetch(url, options);
  return await response.json();
}