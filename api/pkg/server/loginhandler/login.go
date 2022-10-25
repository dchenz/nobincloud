package loginhandler

import (
	"fmt"
	"net/http"
)

func (a *AuthRouter) login(w http.ResponseWriter, r *http.Request) {
	fmt.Println("login")
}
