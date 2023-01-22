package cloudrouter

import (
	"net/http"
)

func (a *CloudRouter) authRequired(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if _, email := a.whoami(r); email == "" {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func (a *CloudRouter) whoami(r *http.Request) (int, string) {
	id := a.SessionManager.GetInt(r.Context(), "current_user_id")
	email := a.SessionManager.GetString(r.Context(), "current_user_email")
	return id, email
}
