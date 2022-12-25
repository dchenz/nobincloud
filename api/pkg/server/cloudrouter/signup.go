package cloudrouter

import (
	"net/http"
	"nobincloud/pkg/database"
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
	if err := a.Database.CreateUserAccount(user); err != nil {
		switch err {
		case database.ErrDuplicateEmail:
			utils.RespondFail(w, http.StatusBadRequest, err.Error())
		default:
			utils.RespondError(w, err.Error())
		}
		return
	}
	utils.ResponseSuccess(w, user.Email)
}
