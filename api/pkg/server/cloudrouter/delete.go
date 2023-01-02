package cloudrouter

import (
	"database/sql"
	"net/http"

	"github.com/dchenz/nobincloud/pkg/utils"
)

func (a *CloudRouter) DeleteFile(w http.ResponseWriter, r *http.Request) {
	fileID, err := utils.GetPathUUID(r, "id")
	if err != nil {
		utils.RespondFail(w, http.StatusBadRequest, "invalid file ID")
		return
	}
	userID, _ := a.whoami(r)
	ownerID, err := a.Database.GetFileOwner(fileID)
	if err == sql.ErrNoRows || ownerID != userID {
		utils.RespondFail(w, http.StatusNotFound, "file not found")
		return
	}
	if err != nil {
		utils.RespondError(w, err.Error())
		return
	}
	if err := a.Files.Delete(fileID); err != nil {
		utils.RespondError(w, err.Error())
		return
	}
	if err := a.Database.DeleteFile(userID, fileID); err != nil {
		utils.RespondError(w, err.Error())
	}
	utils.ResponseSuccess(w, nil)
}
