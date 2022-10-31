package cloudrouter

import "net/http"

func (f *CloudRouter) authenticatedMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

	})
}

func (f *CloudRouter) authorizedMiddleware(next http.Handler) http.Handler {
	authz := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

	})
	return f.authenticatedMiddleware(authz)
}
