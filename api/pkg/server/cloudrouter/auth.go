package cloudrouter

import (
	"net/http"
	"nobincloud/pkg/model"
	"nobincloud/pkg/utils"
	"time"
)

func (a *CloudRouter) LoginUserAccount(w http.ResponseWriter, r *http.Request) {
	var login model.LoginRequest
	if err := utils.GetBody(r, &login); err != nil {
		utils.RespondFail(w, http.StatusBadRequest, err.Error())
		return
	}
	if err := utils.Validate().Struct(login); err != nil {
		utils.RespondFail(w, http.StatusBadRequest, err.Error())
		return
	}
	success, err := a.AccountsDB.CheckUserCredentials(login)
	if err != nil {
		utils.RespondError(w, err.Error())
		return
	}
	if !success {
		utils.RespondFail(w, http.StatusOK, "login failed")
		return
	}
	key, err := a.AccountsDB.GetAccountEncryptionKey(login.Email)
	if err != nil {
		utils.RespondError(w, err.Error())
		return
	}
	session, err := a.SessionStore.Get(r, a.SessionCookieName)
	if err != nil {
		utils.RespondError(w, err.Error())
		return
	}
	session.Values["Expiry"] = time.Now().Add(time.Hour * 24).Unix()
	if err := session.Save(r, w); err != nil {
		utils.RespondError(w, err.Error())
		return
	}
	utils.ResponseSuccess(w, model.LoginResponse{
		AccountEncryptionKey: key,
	})
}

func (a *CloudRouter) LogoutUserAccount(w http.ResponseWriter, r *http.Request) {

}
