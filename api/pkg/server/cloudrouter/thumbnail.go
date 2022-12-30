package cloudrouter

import (
	"net/http"

	"github.com/dchenz/nobincloud/pkg/model"
	"github.com/dchenz/nobincloud/pkg/utils"
)

func (a *CloudRouter) GetThumbnail(w http.ResponseWriter, r *http.Request) {
	fileID, err := utils.GetPathUUID(r, "id")
	if err != nil {
		utils.RespondFail(w, http.StatusBadRequest, "invalid file ID")
		return
	}
	userID, _ := a.whoami(r)
	thumbnail, err := a.Database.GetThumbnail(userID, fileID)
	if err != nil {
		utils.RespondFail(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.ResponseSuccess(w, model.Hexadecimal{Bytes: thumbnail})
}
