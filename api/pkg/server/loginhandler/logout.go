package loginhandler

import (
	"fmt"
	"net/http"
)

func (a *AuthRouter) logout(w http.ResponseWriter, r *http.Request) {
	fmt.Println("logout")
}
