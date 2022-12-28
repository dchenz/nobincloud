import { Box, Button, HStack, Icon } from "@chakra-ui/react";
import React, { ChangeEvent, useContext } from "react";
import { Upload } from "react-bootstrap-icons";
import { encryptAndUploadFile } from "../../../api/uploadFile";
import AuthContext from "../../../context/AuthContext";
import "./styles.scss";

export default function Header(): JSX.Element {
  const { accountKey } = useContext(AuthContext);
  // TODO: Improve the typescript types.
  if (!accountKey) {
    throw new Error();
  }

  const onProgress = (currentChunks: number, totalChunks: number) =>
    console.log(currentChunks, totalChunks);

  const onUploadButtonClick = () => {
    const fileForm = document.createElement("input");
    fileForm.type = "file";
    fileForm.click();
    // @ts-ignore
    fileForm.onchange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const uploadRequest = {
          file: e.target.files[0],
          parentFolder: null,
        };
        encryptAndUploadFile(uploadRequest, accountKey, onProgress);
      }
    };
  };
  return (
    <Box className="file-browser-header">
      <HStack gap={2}>
        <Button color="black" onClick={onUploadButtonClick}>
          <Icon as={Upload}></Icon>&nbsp; Upload
        </Button>
      </HStack>
    </Box>
  );
}
