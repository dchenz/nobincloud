package cloudrouter

import (
	"net/http"

	"github.com/dchenz/nobincloud/pkg/model"
	"github.com/dchenz/nobincloud/pkg/utils"
)

func (a *CloudRouter) ListFolderContents(w http.ResponseWriter, r *http.Request) {
	folderID, err := utils.GetPathUUID(r, "id")
	if err != nil {
		utils.RespondFail(w, http.StatusBadRequest, "invalid folder ID")
		return
	}
	userID, _ := a.whoami(r)
	memberFiles, err := a.Database.GetFilesInFolder(userID, folderID)
	if err != nil {
		utils.RespondError(w, err.Error())
		return
	}
	memberFolders, err := a.Database.GetFoldersInFolder(userID, folderID)
	if err != nil {
		utils.RespondError(w, err.Error())
		return
	}
	utils.ResponseSuccess(w, model.FolderContentsResponse{
		Files:   memberFiles,
		Folders: memberFolders,
	})
}
