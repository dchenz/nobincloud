package cloudrouter

import (
	"net/http"

	"github.com/dchenz/go-assemble"
	"github.com/dchenz/nobincloud/pkg/model"
	"github.com/dchenz/nobincloud/pkg/utils"
)

func (a *CloudRouter) UploadFile(_ http.ResponseWriter, r *http.Request) {
	fileID, err := utils.GetFileMetadataUUID(r, "id")
	if err != nil {
		assemble.RejectFile(r, http.StatusBadRequest, err.Error())
		return
	}
	if !fileID.Valid {
		assemble.RejectFile(r, http.StatusBadRequest, "missing file ID")
		return
	}
	encryptionKey, err := utils.GetFileMetadataBase64(r, "encryptionKey")
	if err != nil {
		assemble.RejectFile(r, http.StatusBadRequest, err.Error())
		return
	}
	if !encryptionKey.Valid {
		assemble.RejectFile(r, http.StatusBadRequest, "missing encryption key")
		return
	}
	encryptedFileMetadata, err := utils.GetFileMetadataBase64(r, "metadata")
	if err != nil {
		assemble.RejectFile(r, http.StatusBadRequest, err.Error())
		return
	}
	if !encryptedFileMetadata.Valid {
		assemble.RejectFile(r, http.StatusBadRequest, "missing file metadata")
		return
	}
	parentFolder, err := utils.GetFileMetadataUUID(r, "parentFolder")
	if err != nil {
		assemble.RejectFile(r, http.StatusBadRequest, err.Error())
		return
	}
	filePath, err := a.Files.Save(fileID.Value, r.Body)
	if err != nil {
		assemble.RejectFile(r, http.StatusInternalServerError, err.Error())
		return
	}
	userID, _ := a.whoami(r)
	f := model.File{
		ID:            fileID.Value,
		ParentFolder:  parentFolder,
		EncryptionKey: encryptionKey.Value,
		Metadata:      encryptedFileMetadata.Value,
		SavedLocation: filePath,
	}
	if err := a.Database.CreateFile(userID, f); err != nil {
		assemble.RejectFile(r, http.StatusInternalServerError, err.Error())
	}
}
