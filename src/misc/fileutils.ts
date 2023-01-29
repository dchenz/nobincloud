import { UUID_NIL } from "../const";
import { FilePath, FileRef, FolderRef, UUID } from "../types/Files";

export function saveFile(buf: ArrayBuffer, fileName: string) {
  const blob = new Blob([buf]);
  const blobURL = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobURL;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(blobURL);
}

export function isImage(file: FileRef): boolean {
  return file.metadata.type.startsWith("image/");
}

export function isPDF(file: FileRef): boolean {
  return file.metadata.type === "application/pdf";
}

export function formatBinarySize(n: number): string {
  if (n < 1024) {
    return `${n.toFixed(2)} B`;
  }
  n /= 1024;
  if (n < 1024) {
    return `${n.toFixed(2)} KB`;
  }
  n /= 1024;
  if (n < 1024) {
    return `${n.toFixed(2)} MB`;
  }
  n /= 1024;
  return `${n.toFixed(2)} GB`;
}

export function formatRelativeTime(date: Date): string {
  let n = (Date.now() - date.getTime()) / 1000;
  if (n < 60) {
    return "Just now";
  }
  n /= 60;
  if (n < 60) {
    return `${Math.floor(n)}min ago`;
  }
  n /= 60;
  if (n < 24) {
    return `${Math.floor(n)}hr ago`;
  }
  return date.toLocaleString();
}

export function isRootFolder(folderID: UUID): boolean {
  return folderID === UUID_NIL;
}

export function getUploadDisplayName(
  fileList: FileList,
  asFolder?: boolean
): string {
  if (fileList.length === 0) {
    return "";
  }
  if (asFolder) {
    return fileList[0].webkitRelativePath.split("/")[0];
  }
  const components = [];
  for (let i = 0; i < 5; i++) {
    const f = fileList.item(i);
    if (!f) {
      break;
    }
    components.push(f.name);
  }
  let name = components.join(", ");
  if (fileList.length > components.length) {
    name += ` and ${fileList.length - components.length} more`;
  }
  return name;
}

export function isSubfolderOrEqual(
  folder: FolderRef,
  testItem: FilePath
): boolean {
  if (testItem.current.id === folder.id) {
    return true;
  }
  for (const ancestorFolder of testItem.parents) {
    if (ancestorFolder.id === folder.id) {
      return true;
    }
  }
  return false;
}
