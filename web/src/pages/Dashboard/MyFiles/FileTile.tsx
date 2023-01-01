import { Box, Image, Text } from "@chakra-ui/react";
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
    <Box width={200}>
      <Image src={thumbnail} alt={file.name} width="96px" margin="0 auto" />
      <Box p={3}>
        <Text whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
          {file.name}
        </Text>
      </Box>
    </Box>
  );
};

export default FileTile;
