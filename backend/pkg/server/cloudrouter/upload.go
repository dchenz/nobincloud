package cloudrouter

import (
	"net/http"

	"github.com/dchenz/nobincloud/pkg/model"
	"github.com/dchenz/nobincloud/pkg/utils"
	"github.com/google/uuid"
)

func (a *CloudRouter) UploadFile(w http.ResponseWriter, r *http.Request) {
	var file model.File
	if err := utils.UnmarshalFormData(r, "encryptionKey", &file.EncryptionKey); err != nil {
		utils.RespondFail(w, http.StatusBadRequest, err.Error())
		return
	}
	if err := utils.UnmarshalFormData(r, "parentFolder", &file.ParentFolder); err != nil {
		utils.RespondFail(w, http.StatusBadRequest, err.Error())
		return
	}
	if err := utils.UnmarshalFormData(r, "metadata", &file.Metadata); err != nil {
		utils.RespondFail(w, http.StatusBadRequest, err.Error())
		return
	}
	mpFile, _, err := r.FormFile("file")
	if err != nil {
		utils.RespondFail(w, http.StatusBadRequest, err.Error())
		return
	}
	file.ID = uuid.New()
	filePath, err := a.Files.Save(file.ID, mpFile)
	if err != nil {
		utils.RespondError(w, err.Error())
		return
	}
	file.SavedLocation = filePath
	userID, _ := a.whoami(r)
	if err := a.Database.CreateFile(userID, file); err != nil {
		utils.RespondError(w, err.Error())
		return
	}
	utils.ResponseSuccess(w, file.ID)
}
