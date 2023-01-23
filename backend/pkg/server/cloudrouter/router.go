package cloudrouter

import (
	"net/http"

	"github.com/dchenz/nobincloud/pkg/database"
	"github.com/dchenz/nobincloud/pkg/filestore"

	"github.com/alexedwards/scs/v2"
	"github.com/gorilla/mux"
)

type CloudRouter struct {
	Database       *database.Database
	Files          *filestore.FileStore
	SessionManager *scs.SessionManager
	CaptchaSecret  string
	DevMode        bool
}

func (a *CloudRouter) RegisterRoutes(r *mux.Router) {
	a.registerUserRouter(r.PathPrefix("/user").Subrouter())
	a.registerFileRouter(r.PathPrefix("/file").Subrouter())
	a.registerFolderRouter(r.PathPrefix("/folder").Subrouter())
	a.registerBatchRouter(r.PathPrefix("/batch").Subrouter())
}

func (a *CloudRouter) registerUserRouter(r *mux.Router) {
	registerHandler := http.Handler(http.HandlerFunc(a.SignUpNewUser))
	if !a.DevMode {
		registerHandler = a.captchaRequired(registerHandler)
	}
	r.HandleFunc("/login", a.Login).Methods("POST")
	r.HandleFunc("/logout", a.Logout).Methods("POST")
	r.HandleFunc("/unlock", a.LockedLogin).Methods("POST")
	r.HandleFunc("/whoami", a.WhoAmI).Methods("GET")
	r.Handle("/register", registerHandler).Methods("POST")
}

func (a *CloudRouter) registerFileRouter(r *mux.Router) {
	r.Use(a.authRequired)
	r.HandleFunc("", a.UploadFile).Methods("POST")
	r.HandleFunc("/{id}", a.DownloadFile).Methods("GET")
}

func (a *CloudRouter) registerFolderRouter(r *mux.Router) {
	r.Use(a.authRequired)
	r.HandleFunc("", a.CreateFolder).Methods("POST")
	r.HandleFunc("/{id}/list", a.ListFolderContents).Methods("GET")
}

func (a *CloudRouter) registerBatchRouter(r *mux.Router) {
	r.Use(a.authRequired)
	r.HandleFunc("", a.DeleteFilesAndFolders).Methods("DELETE")
}
