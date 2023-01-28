import { Box } from "@chakra-ui/react";
import React, { useContext } from "react";
import FolderContext from "../../context/FolderContext";
import CompletedIcon from "./CompletedIcon";
import ProgressIcon from "./ProgressIcon";
import "./styles.sass";

const UploadsTracker: React.FC = () => {
  const { uploads, removeUpload } = useContext(FolderContext);
  if (uploads.length === 0) {
    return null;
  }
  return (
    <Box className="uploads-tracker">
      {uploads.map((upload) => (
        <Box className="upload-item" key={upload.id}>
          {upload.current < upload.total ? (
            <ProgressIcon current={upload.current} total={upload.total} />
          ) : (
            <CompletedIcon onClick={() => removeUpload(upload.id)} />
          )}
          <Box className="upload-item-name" title={upload.title}>
            {upload.title}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default UploadsTracker;
