package cloudrouter

import (
	"net/http"
	"nobincloud/pkg/accountsdb"
	"nobincloud/pkg/filesdb"

	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
)

type CloudRouter struct {
	FilesDB           *filesdb.FilesDB
	AccountsDB        *accountsdb.AccountsDB
	SessionStore      *sessions.CookieStore
	SessionCookieName string
}

func (a *CloudRouter) RegisterRoutes(r *mux.Router) {
	u := r.PathPrefix("/user").Subrouter()
	u.Handle("/login", http.HandlerFunc(a.LoginUserAccount)).Methods("POST")
	u.Handle("/logout", http.HandlerFunc(a.LogoutUserAccount)).Methods("POST")
	u.Handle("/register", http.HandlerFunc(a.SignUpNewUser)).Methods("POST")
	f := r.PathPrefix("/files").Subrouter()
	f.Handle("/{id}", a.authorizedMiddleware(http.HandlerFunc(a.DownloadFile))).Methods("GET")
	f.Handle("/", a.authenticatedMiddleware(http.HandlerFunc(a.UploadFile))).Methods("POST")
	f.Handle("/{id}", a.authorizedMiddleware(http.HandlerFunc(a.UploadFile))).Methods("POST")
	f.Handle("/{id}", a.authorizedMiddleware(http.HandlerFunc(a.DeleteFile))).Methods("DELETE")
}
