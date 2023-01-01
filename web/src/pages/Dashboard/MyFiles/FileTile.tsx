import { Box } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../../context/AuthContext";
import { loadFileThumbnail } from "../../../misc/thumbnails";
import { FileRef } from "../../../types/Files";

type FileTileProps = {
  file: FileRef;
};

const FileTile: React.FC<FileTileProps> = ({ file }) => {
  const [thumbnail, setThumbnail] = useState<string>("");
  const { accountKey } = useContext(AuthContext);
  if (!accountKey) {
    throw new Error();
  }

  useEffect(() => {
    loadFileThumbnail(file, accountKey).then((t) => setThumbnail(t ?? ""));
  }, []);

  return (
    <Box>
      <img src={thumbnail} alt={file.name} width="96px" />
      <span>{file.name}</span>
    </Box>
  );
};

export default FileTile;
