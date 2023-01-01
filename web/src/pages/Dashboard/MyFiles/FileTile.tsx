import { Box } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { getThumbnail } from "../../../api/files";
import AuthContext from "../../../context/AuthContext";
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
    getThumbnail(file, accountKey).then((t) => setThumbnail(t ?? ""));
  }, []);

  return (
    <Box>
      <img src={thumbnail} alt={file.name} />
      {file.name}
    </Box>
  );
};

export default FileTile;
