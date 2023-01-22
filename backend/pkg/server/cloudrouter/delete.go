package cloudrouter

import (
	"net/http"

	"github.com/dchenz/nobincloud/pkg/errors"
	"github.com/dchenz/nobincloud/pkg/utils"
)

func (a *CloudRouter) DeleteFile(w http.ResponseWriter, r *http.Request) {
	userID, _ := a.whoami(r)

	fileUUID, err := utils.GetPathUUID(r, "id")
	if err != nil {
		utils.RespondFail(w, http.StatusBadRequest, "invalid file ID")
		return
	}
	err = a.Database.DeleteFile(userID, fileUUID)
	if err == errors.ErrNotAuthorized {
		utils.RespondFail(w, http.StatusForbidden, err.Error())
		return
	}
	if err != nil {
		utils.RespondError(w, err.Error())
		return
	}
	if err := a.Files.Delete(fileUUID); err != nil {
		utils.RespondError(w, err.Error())
		return
	}
	utils.ResponseSuccess(w, nil)
}
