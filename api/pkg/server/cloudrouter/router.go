package cloudrouter

import (
	"net/http"

	"github.com/dchenz/go-assemble"
	"github.com/dchenz/nobincloud/pkg/database"
	"github.com/dchenz/nobincloud/pkg/filestore"

	"github.com/alexedwards/scs/v2"
	"github.com/gorilla/mux"
)

type CloudRouter struct {
	Database       *database.Database
	Files          *filestore.FileStore
	SessionManager *scs.SessionManager
	UploadManager  *assemble.FileChunksAssembler
}

func (a *CloudRouter) RegisterRoutes(r *mux.Router) {
	u := r.PathPrefix("/user").Subrouter()
	u.Handle("/login", http.HandlerFunc(a.Login)).Methods("POST")
	u.Handle("/logout", http.HandlerFunc(a.Logout)).Methods("POST")
	u.Handle("/register", http.HandlerFunc(a.SignUpNewUser)).Methods("POST")
	u.Handle("/unlock", a.authenticatedMiddleware(http.HandlerFunc(a.LockedLogin))).Methods("POST")
	u.Handle("/whoami", a.authenticatedMiddleware(http.HandlerFunc(a.WhoAmI))).Methods("GET")

	c := r.PathPrefix("/upload").Subrouter()

	c.Handle("/init",
		a.authenticatedMiddleware(
			http.HandlerFunc(a.UploadManager.UploadStartHandler),
		),
	).Methods("POST")

	c.Handle("/parts",
		a.authenticatedMiddleware(
			a.UploadManager.ChunksMiddleware(
				http.HandlerFunc(a.UploadFile),
			),
		),
	).Methods("POST")

	f := r.PathPrefix("/file").Subrouter()
	f.Handle("/{id}", a.authenticatedMiddleware(http.HandlerFunc(a.DownloadFile))).Methods("GET")
	f.Handle("/{id}", a.authenticatedMiddleware(http.HandlerFunc(a.DeleteFile))).Methods("DELETE")

	d := r.PathPrefix("/folder").Subrouter()
	d.Handle("/{id}/list", http.HandlerFunc(a.ListFolderContents)).Methods("GET")

	t := r.PathPrefix("/thumbnail").Subrouter()
	t.Handle("/{id}", a.authenticatedMiddleware(http.HandlerFunc(a.GetThumbnail))).Methods("GET")
}
