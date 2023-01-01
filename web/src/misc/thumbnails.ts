import { getThumbnail } from "../api/files";
import { FileRef } from "../types/Files";

const THUMBNAIL_SIZE = 64;

/**
 * Generates a thumbnail for a file to upload to the server.
 * If a file has no thumbnail (NULL), it will use a default icon
 * when rendered in React based on its mimetype.
 *
 * @param file File object
 * @returns Returns a base64 thumbnail image or NULL
 */
export async function createCustomFileThumbnail(
  file: File
): Promise<ArrayBuffer | null> {
  if (file.type.startsWith("image/")) {
    return await createImageThumbnail(file);
  }
  return null;
}

/**
 * Loads the thumbnail for a file to be rendered. If there is no
 * thumbnail, it will return a default icon based on its mimetype.
 *
 * @param file File object
 * @returns Returns the src attribute for a thumbnail image
 */
export async function loadFileThumbnail(
  file: FileRef,
  accountKey: ArrayBuffer
): Promise<string> {
  const thumbnail = await getThumbnail(file, accountKey);
  if (thumbnail) {
    return thumbnail;
  }
  return "/static/media/file-icon.png";
}

async function createImageThumbnail(f: File): Promise<ArrayBuffer> {
  return new Promise(async (resolve, reject) => {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = THUMBNAIL_SIZE;
      canvas.height = THUMBNAIL_SIZE;
      canvas
        .getContext("2d")
        ?.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          0,
          0,
          THUMBNAIL_SIZE,
          THUMBNAIL_SIZE
        );
      canvas.toBlob((b) => {
        if (b) {
          b.arrayBuffer().then((res) => resolve(res));
        } else {
          reject("empty canvas");
        }
      }, f.type);
    };
    img.src = await blobToDataURL(f);
  });
}

function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (_e) => resolve(reader.result as string);
    reader.onerror = (_e) => reject(reader.error);
    reader.onabort = (_e) => reject(new Error("Read aborted"));
    reader.readAsDataURL(blob);
  });
}
