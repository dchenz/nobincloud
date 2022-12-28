package cloudrouter

import (
	"net/http"

	"github.com/dchenz/nobincloud/pkg/model"
	"github.com/dchenz/nobincloud/pkg/utils"
)

func (a *CloudRouter) Login(w http.ResponseWriter, r *http.Request) {
	var login model.LoginRequest
	if err := utils.GetBody(r, &login); err != nil {
		utils.RespondFail(w, http.StatusBadRequest, err.Error())
		return
	}
	if err := utils.Validate().Struct(login); err != nil {
		utils.RespondFail(w, http.StatusBadRequest, err.Error())
		return
	}
	success, err := a.Database.CheckUserCredentials(login)
	if err != nil {
		utils.RespondError(w, err.Error())
		return
	}
	if !success {
		utils.RespondFail(w, http.StatusOK, "login failed")
		return
	}
	key, err := a.Database.GetAccountEncryptionKey(login.Email)
	if err != nil {
		utils.RespondError(w, err.Error())
		return
	}
	if err := a.SessionManager.RenewToken(r.Context()); err != nil {
		utils.RespondError(w, err.Error())
		return
	}
	accountID, err := a.Database.ResolveAccountID(login.Email)
	if err != nil {
		utils.RespondError(w, err.Error())
		return
	}
	a.SessionManager.Put(r.Context(), "current_user_id", accountID)
	a.SessionManager.Put(r.Context(), "current_user_email", login.Email)
	utils.ResponseSuccess(w, model.LoginResponse{
		AccountEncryptionKey: key,
	})
}

func (a *CloudRouter) Logout(w http.ResponseWriter, r *http.Request) {
	if err := a.SessionManager.RenewToken(r.Context()); err != nil {
		utils.RespondError(w, err.Error())
		return
	}
	if err := a.SessionManager.Destroy(r.Context()); err != nil {
		utils.RespondError(w, err.Error())
		return
	}
	utils.ResponseSuccess(w, nil)
}
