package cloudrouter

import (
	"net/http"
)

func (a *CloudRouter) authenticatedMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if a.whoami(r) == "" {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func (a *CloudRouter) whoami(r *http.Request) string {
	return a.SessionManager.GetString(r.Context(), "email")
}
