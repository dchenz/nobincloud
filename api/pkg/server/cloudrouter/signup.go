package cloudrouter

import (
	"net/http"

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
	utils.ResponseSuccess(w, nil)
}
