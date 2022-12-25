package cloudrouter

import (
	"net/http"
	"nobincloud/pkg/usersdb"

	"github.com/alexedwards/scs/v2"
	"github.com/gorilla/mux"
)

type CloudRouter struct {
	UsersDB        *usersdb.UsersDB
	SessionManager *scs.SessionManager
}

func (a *CloudRouter) RegisterRoutes(r *mux.Router) {
	u := r.PathPrefix("/user").Subrouter()
	u.Handle("/login", http.HandlerFunc(a.Login)).Methods("POST")
	u.Handle("/logout", http.HandlerFunc(a.Logout)).Methods("POST")
	u.Handle("/register", http.HandlerFunc(a.SignUpNewUser)).Methods("POST")
	f := r.PathPrefix("/files").Subrouter()
	f.Handle("/{id}", a.authenticatedMiddleware(http.HandlerFunc(a.DownloadFile))).Methods("GET")
	f.Handle("/{id}", a.authenticatedMiddleware(http.HandlerFunc(a.UploadFile))).Methods("PUT")
	f.Handle("/{id}", a.authenticatedMiddleware(http.HandlerFunc(a.DeleteFile))).Methods("DELETE")
}
