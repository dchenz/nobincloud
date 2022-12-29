package cloudrouter

import (
	"net/http"

	"github.com/dchenz/nobincloud/pkg/model"
	"github.com/dchenz/nobincloud/pkg/utils"
	"github.com/google/uuid"
)

func (a *CloudRouter) ListFolderContents(w http.ResponseWriter, r *http.Request) {
	userID, _ := a.whoami(r)
	folderIDStr := r.URL.Query().Get("id")
	var folderID uuid.UUID
	if folderIDStr != "" {
		parsed, err := uuid.Parse(folderIDStr)
		if err != nil {
			utils.RespondFail(w, http.StatusBadRequest, "invalid folder ID")
			return
		}
		folderID = parsed
	}
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
