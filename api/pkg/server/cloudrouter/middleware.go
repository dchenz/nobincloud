package cloudrouter

import "net/http"

func (f *CloudRouter) authenticatedMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, err := f.SessionStore.Get(r, f.SessionCookieName)
		if err != nil {
			return
		}
		next.ServeHTTP(w, r)
	})
}
