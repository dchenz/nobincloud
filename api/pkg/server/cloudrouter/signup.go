package cloudrouter

import (
	"net/http"
	"nobincloud/pkg/model"
	"nobincloud/pkg/utils"
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
	if err := a.AccountsDB.CreateUserAccount(user); err != nil {
		utils.RespondError(w, err.Error())
		return
	}
	utils.ResponseSuccess(w, user.Email)
}
