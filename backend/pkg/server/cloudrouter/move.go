package cloudrouter

import (
	"net/http"

	"github.com/dchenz/nobincloud/pkg/errors"
	"github.com/dchenz/nobincloud/pkg/model"
	"github.com/dchenz/nobincloud/pkg/utils"
)

func (a *CloudRouter) MoveFilesAndFolders(w http.ResponseWriter, r *http.Request) {
	userID, _ := a.whoami(r)

	var moveReq model.MoveFolderContentsRequest
	if err := utils.GetBody(r, &moveReq); err != nil {
		utils.RespondFail(w, http.StatusBadRequest, err.Error())
		return
	}
	isMovingIntoRoot := !moveReq.Into.Valid
	if len(moveReq.Items.Files) > 0 {
		err := a.Database.MoveFiles(
			userID,
			moveReq.Items.Files,
			moveReq.Into.Value,
			isMovingIntoRoot,
		)
		if err == errors.ErrNotAuthorized {
			utils.RespondFail(w, http.StatusForbidden, err.Error())
			return
		}
		if err != nil {
			utils.RespondError(w, err.Error())
			return
		}
	}
	if len(moveReq.Items.Folders) > 0 {
		err := a.Database.MoveFolders(
			userID,
			moveReq.Items.Folders,
			moveReq.Into.Value,
			isMovingIntoRoot,
		)
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
