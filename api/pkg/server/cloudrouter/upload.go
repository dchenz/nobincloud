package cloudrouter

import (
	"encoding/hex"
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
	fileKey, err := utils.GetFileMetadataHex(r, "key")
	if err != nil {
		assemble.RejectFile(r, http.StatusBadRequest, err.Error())
		return
	}
	if !fileKey.Valid {
		assemble.RejectFile(r, http.StatusBadRequest, "missing file key")
		return
	}
	fileName, err := utils.GetFileMetadataHex(r, "name")
	if err != nil {
		assemble.RejectFile(r, http.StatusBadRequest, err.Error())
		return
	}
	if !fileName.Valid {
		assemble.RejectFile(r, http.StatusBadRequest, "missing file name")
		return
	}
	fileType, err := utils.GetFileMetadataString(r, "type")
	if err != nil {
		assemble.RejectFile(r, http.StatusBadRequest, err.Error())
		return
	}
	if !fileType.Valid {
		fileType.Valid = true
		fileType.Value = "application/octet-stream"
	}
	parentFolder, err := utils.GetFileMetadataUUID(r, "parent_folder")
	if err != nil {
		assemble.RejectFile(r, http.StatusBadRequest, err.Error())
		return
	}
	thumbnailStr, err := utils.GetFileMetadataString(r, "thumbnail")
	if err != nil {
		assemble.RejectFile(r, http.StatusBadRequest, err.Error())
		return
	}
	var thumbnail model.JSON[[]byte]
	if thumbnailStr.Valid {
		b, err := hex.DecodeString(thumbnailStr.Value)
		if err != nil {
			assemble.RejectFile(r, http.StatusBadRequest, err.Error())
			return
		}
		thumbnail.Valid = true
		thumbnail.Value = b
	}
	filePath, err := a.Files.Save(fileID.Value, r.Body)
	if err != nil {
		assemble.RejectFile(r, http.StatusInternalServerError, err.Error())
		return
	}
	userID, _ := a.whoami(r)
	f := model.File{
		ID:            fileID.Value,
		Name:          fileName.Value,
		ParentFolder:  parentFolder,
		EncryptionKey: fileKey.Value,
		SavedLocation: filePath,
		Thumbnail:     thumbnail,
		MimeType:      fileType.Value,
	}
	if err := a.Database.CreateFile(userID, f); err != nil {
		assemble.RejectFile(r, http.StatusInternalServerError, err.Error())
	}
}
