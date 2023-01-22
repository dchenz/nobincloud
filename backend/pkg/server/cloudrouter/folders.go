package cloudrouter

import (
	"net/http"

	"github.com/dchenz/nobincloud/pkg/errors"
	"github.com/dchenz/nobincloud/pkg/model"
	"github.com/dchenz/nobincloud/pkg/utils"
	"github.com/google/uuid"
)

func (a *CloudRouter) ListFolderContents(w http.ResponseWriter, r *http.Request) {
	userID, _ := a.whoami(r)

	folderUUID, err := utils.GetPathUUID(r, "id")
	if err != nil {
		utils.RespondFail(w, http.StatusBadRequest, "invalid folder ID")
		return
	}
	isRootFolder := folderUUID == uuid.Nil
	memberFiles, err := a.Database.GetFilesInFolder(userID, folderUUID, isRootFolder)
	if err == errors.ErrNotAuthorized {
		utils.RespondFail(w, http.StatusForbidden, err.Error())
		return
	}
	if err != nil {
		utils.RespondError(w, err.Error())
		return
	}
	memberFolders, err := a.Database.GetFoldersInFolder(userID, folderUUID, isRootFolder)
	if err != nil {
		utils.RespondError(w, err.Error())
		return
	}
	utils.ResponseSuccess(w, model.FolderContentsResponse{
		Files:   memberFiles,
		Folders: memberFolders,
	})
}

func (a *CloudRouter) CreateFolder(w http.ResponseWriter, r *http.Request) {
	userID, _ := a.whoami(r)

	var folderReq model.Folder
	if err := utils.GetBody(r, &folderReq); err != nil {
		utils.RespondFail(w, http.StatusBadRequest, "invalid request body")
		return
	}
	folderReq.ID = uuid.New()
	err := a.Database.CreateFolder(userID, folderReq)
	if err == errors.ErrNotAuthorized {
		utils.RespondFail(w, http.StatusForbidden, err.Error())
		return
	}
	if err != nil {
		utils.RespondError(w, err.Error())
		return
	}
	utils.ResponseSuccess(w, folderReq.ID)
}
