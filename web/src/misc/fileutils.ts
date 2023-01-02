export function saveFile(buf: ArrayBuffer, fileName: string) {
  const blob = new Blob([buf]);
  const blobURL = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobURL;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(blobURL);
}