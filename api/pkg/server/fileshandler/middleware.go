package fileshandler

import "net/http"

func (f *FilesRouter) authenticatedMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

	})
}

func (f *FilesRouter) authorizedMiddleware(next http.Handler) http.Handler {
	authz := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

	})
	return f.authenticatedMiddleware(authz)
}
