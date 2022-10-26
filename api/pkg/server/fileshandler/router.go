package fileshandler

import (
	"net/http"

	"github.com/gorilla/mux"
)

type FilesDB interface {
}

type FilesRouter struct {
}

func (f *FilesRouter) RegisterRoutes(r *mux.Router) {
	r.Handle("/{id}", f.authorizedMiddleware(http.HandlerFunc(downloadFile))).Methods("GET")
	r.Handle("/", f.authenticatedMiddleware(http.HandlerFunc(uploadFile))).Methods("POST")
	r.Handle("/{id}", f.authorizedMiddleware(http.HandlerFunc(uploadFile))).Methods("POST")
	r.Handle("/{id}", f.authorizedMiddleware(http.HandlerFunc(deleteFile))).Methods("DELETE")
}

func NewRouter() *FilesRouter {
	return &FilesRouter{}
}
