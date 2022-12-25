import { ServerRoutes } from "../const";
import { generateWrappedKey } from "../crypto/password";
import { arrayBufferToString, uuid } from "../crypto/utils";
import { FileUploadDetails } from "../types/Files";

export async function uploadFile(uploaded: FileUploadDetails) {
  const id = uploaded.id ?? uuid();
  const url = `${ServerRoutes.uploadFile}/${id}`;
  const [encryptedFileKey, _] = await generateWrappedKey(uploaded.key);
  const form = new FormData();
  form.append("file", uploaded.file);
  form.append("key", arrayBufferToString(encryptedFileKey, "hex"));
  const response = await fetch(url, {
    method: "PUT",
    body: form,
  });
  const result = await response.text();
  console.log(result);
}