package cloudrouter

import (
	"database/sql"
	"io"
	"net/http"

	"github.com/dchenz/nobincloud/pkg/utils"
)

func (a *CloudRouter) DownloadFile(w http.ResponseWriter, r *http.Request) {
	userID, _ := a.whoami(r)

	fileUUID, err := utils.GetPathUUID(r, "id")
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	ownerID, err := a.Database.GetFileOwner(fileUUID)
	if err == sql.ErrNoRows {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	if userID != ownerID {
		w.WriteHeader(http.StatusForbidden)
		return
	}
	f, err := a.Files.Load(fileUUID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	if _, err := io.Copy(w, f); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
	}
}
