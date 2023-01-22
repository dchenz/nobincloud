package cloudrouter

import (
	"github.com/dchenz/nobincloud/pkg/database"
	"github.com/dchenz/nobincloud/pkg/filestore"

	"github.com/alexedwards/scs/v2"
	"github.com/gorilla/mux"
)

type CloudRouter struct {
	Database       *database.Database
	Files          *filestore.FileStore
	SessionManager *scs.SessionManager
}

func (a *CloudRouter) RegisterRoutes(r *mux.Router) {
	a.registerUserRouter(r.PathPrefix("/user").Subrouter())
	a.registerFileRouter(r.PathPrefix("/file").Subrouter())
	a.registerFolderRouter(r.PathPrefix("/folder").Subrouter())
}

func (a *CloudRouter) registerUserRouter(r *mux.Router) {
	r.HandleFunc("/login", a.Login).Methods("POST")
	r.HandleFunc("/logout", a.Logout).Methods("POST")
	r.HandleFunc("/register", a.SignUpNewUser).Methods("POST")
	r.HandleFunc("/unlock", a.LockedLogin).Methods("POST")
	r.HandleFunc("/whoami", a.WhoAmI).Methods("GET")
}

func (a *CloudRouter) registerFileRouter(r *mux.Router) {
	r.Use(a.authRequired)
	r.HandleFunc("", a.UploadFile).Methods("POST")
	r.HandleFunc("/{id}", a.DownloadFile).Methods("GET")
	r.HandleFunc("/{id}", a.DeleteFile).Methods("DELETE")
}

func (a *CloudRouter) registerFolderRouter(r *mux.Router) {
	r.Use(a.authRequired)
	r.HandleFunc("/{id}", a.CreateFolder).Methods("PUT")
	r.HandleFunc("/{id}/list", a.ListFolderContents).Methods("GET")
}
