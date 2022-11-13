package cloudrouter

import (
	"fmt"
	"net/http"
	"nobincloud/pkg/utils"
)

func (a *CloudRouter) UploadFile(w http.ResponseWriter, r *http.Request) {
	fileID, err := utils.GetPathID(r, "id")
	if err != nil {
		utils.RespondFail(w, http.StatusBadRequest, err.Error())
		return
	}
	_, handler, err := r.FormFile("file")
	if err != nil {
		utils.RespondFail(w, http.StatusBadRequest, err.Error())
		return
	}
	fmt.Println(handler.Filename, handler.Size)
	utils.ResponseSuccess(w, fileID)
}
