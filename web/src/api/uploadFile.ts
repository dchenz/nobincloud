import { ServerRoutes } from "../const";
import { encrypt } from "../crypto/cipher";
import { generateWrappedKey } from "../crypto/password";
import { arrayBufferToString, uuid } from "../crypto/utils";
import {
  FileUploadDetails,
  UploadInitResponse,
  UploadPartsResponse,
} from "../types/Files";

const CHUNK_SIZE = 2 ** 24;

export async function encryptAndUploadFile(
  fileUpload: FileUploadDetails,
  accountKey: ArrayBuffer,
  onProgress: (current: number, total: number) => void
) {
  const [encryptedFileKey, fileKey] = await generateWrappedKey(accountKey);
  const totalChunks = Math.ceil(fileUpload.file.size / CHUNK_SIZE);
  const initResponse: UploadInitResponse = await (
    await fetch(ServerRoutes.uploadInit, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        total_chunks: totalChunks,
        metadata: {
          key: arrayBufferToString(encryptedFileKey, "hex"),
          name: fileUpload.file.name,
          type: fileUpload.file.type,
          id: uuid(),
        },
      }),
    })
  ).json();
  for (let i = 0; i < totalChunks; i++) {
    const chunkBytes = await fileUpload.file
      .slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
      .arrayBuffer();

    const encryptedChunkBytes = await encrypt(chunkBytes, fileKey);

    fetch(ServerRoutes.uploadParts, {
      method: "POST",
      headers: {
        "x-assemble-upload-id": `${initResponse.id}`,
        "x-assemble-chunk-id": `${i}`,
      },
      body: encryptedChunkBytes,
    })
      .then((resp) => resp.json())
      .then((resp: UploadPartsResponse) => {
        if (resp.error) {
          throw new Error(resp.error);
        }
        onProgress(resp.have, resp.want);
      });
  }
}
