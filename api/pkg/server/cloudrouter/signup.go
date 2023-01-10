package cloudrouter

import (
	"net/http"
	"time"

	"github.com/dchenz/nobincloud/pkg/database"
	"github.com/dchenz/nobincloud/pkg/model"
	"github.com/dchenz/nobincloud/pkg/utils"
)

func (a *CloudRouter) SignUpNewUser(w http.ResponseWriter, r *http.Request) {
	var user model.NewUserRequest
	if err := utils.GetBody(r, &user); err != nil {
		utils.RespondFail(w, http.StatusBadRequest, err.Error())
		return
	}
	if err := utils.Validate().Struct(user); err != nil {
		utils.RespondFail(w, http.StatusBadRequest, err.Error())
		return
	}
	if err := a.Database.CreateUserAccount(user); err != nil {
		switch err {
		case database.ErrDuplicateEmail:
			utils.RespondFail(w, http.StatusBadRequest, err.Error())
		default:
			utils.RespondError(w, err.Error())
		}
		return
	}
	if err := a.SessionManager.RenewToken(r.Context()); err != nil {
		utils.RespondError(w, err.Error())
		return
	}
	accountID, err := a.Database.ResolveAccountID(user.Email)
	if err != nil {
		utils.RespondError(w, err.Error())
		return
	}
	a.SessionManager.Put(r.Context(), "current_user_id", accountID)
	a.SessionManager.Put(r.Context(), "current_user_email", user.Email)
	http.SetCookie(w, &http.Cookie{
		Name:     "signed_in",
		Value:    "true",
		Path:     a.SessionManager.Cookie.Path,
		Domain:   a.SessionManager.Cookie.Domain,
		Expires:  time.Now().Add(a.SessionManager.Lifetime),
		SameSite: a.SessionManager.Cookie.SameSite,
		HttpOnly: false,
	})
	utils.ResponseSuccess(w, nil)
}
