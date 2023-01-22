package cloudrouter

import (
	"net/http"

	"github.com/dchenz/nobincloud/pkg/errors"
	"github.com/dchenz/nobincloud/pkg/model"
	"github.com/dchenz/nobincloud/pkg/utils"
)

func (a *CloudRouter) DeleteFilesAndFolders(w http.ResponseWriter, r *http.Request) {
	userID, _ := a.whoami(r)

	var deleteReq model.FolderContentsRequest
	if err := utils.GetBody(r, &deleteReq); err != nil {
		utils.RespondFail(w, http.StatusBadRequest, err.Error())
		return
	}
	if len(deleteReq.Files) > 0 {
		err := a.Database.DeleteFiles(userID, deleteReq.Files)
		if err == errors.ErrNotAuthorized {
			utils.RespondFail(w, http.StatusForbidden, err.Error())
			return
		}
		if err != nil {
			utils.RespondError(w, err.Error())
			return
		}
	}
	if len(deleteReq.Folders) > 0 {
		err := a.Database.DeleteFolders(userID, deleteReq.Folders)
		if err == errors.ErrNotAuthorized {
			utils.RespondFail(w, http.StatusForbidden, err.Error())
			return
		}
		if err != nil {
			utils.RespondError(w, err.Error())
			return
		}
	}
	utils.ResponseSuccess(w, nil)
}
