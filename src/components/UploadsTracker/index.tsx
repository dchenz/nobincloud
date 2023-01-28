import { Box, CircularProgress, IconButton } from "@chakra-ui/react";
import React, { useContext } from "react";
import { CheckCircleFill } from "react-bootstrap-icons";
import FolderContext from "../../context/FolderContext";
import "./styles.sass";

const UploadsTracker: React.FC = () => {
  const { uploads, removeUpload } = useContext(FolderContext);
  if (!uploads.length) {
    return null;
  }
  return (
    <Box className="uploads-tracker">
      {uploads.map((upload) => (
        <Box className="upload-item" key={upload.id}>
          {upload.current < upload.total ? (
            <Box borderRadius="50%" padding="8px">
              <CircularProgress
                size="24px"
                thickness="12px"
                value={(upload.current * 100) / upload.total}
              />
            </Box>
          ) : (
            <IconButton
              variant="ghost"
              aria-label="close"
              onClick={() => removeUpload(upload.id)}
              borderRadius="50%"
            >
              <CheckCircleFill color="#3db535" size="24px" />
            </IconButton>
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
