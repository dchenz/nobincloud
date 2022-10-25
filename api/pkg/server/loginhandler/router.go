package loginhandler

import (
	"net/http"

	"github.com/gorilla/mux"
	"github.com/gorilla/sessions"
)

type AuthRouter struct {
	SessionStore *sessions.CookieStore
}

func (a *AuthRouter) RegisterRoutes(r *mux.Router) {
	r.Handle("/login", http.HandlerFunc(a.login)).Methods("POST")
	r.Handle("/logout", http.HandlerFunc(a.logout)).Methods("POST")
}

func NewRouter(secret []byte) *AuthRouter {
	return &AuthRouter{
		SessionStore: sessions.NewCookieStore(secret),
	}
}
