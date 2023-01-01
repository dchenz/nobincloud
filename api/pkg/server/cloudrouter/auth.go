package cloudrouter

import (
	"net/http"
	"time"

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
	http.SetCookie(w, &http.Cookie{
		Name:     "signed_in",
		Value:    "true",
		Path:     a.SessionManager.Cookie.Path,
		Domain:   a.SessionManager.Cookie.Domain,
		Expires:  time.Now().Add(a.SessionManager.Lifetime),
		SameSite: a.SessionManager.Cookie.SameSite,
		HttpOnly: false,
	})
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

func (a *CloudRouter) LockedLogin(w http.ResponseWriter, r *http.Request) {
	_, email := a.whoami(r)
	var login model.LockedLoginRequest
	if err := utils.GetBody(r, &login); err != nil {
		utils.RespondFail(w, http.StatusBadRequest, err.Error())
		return
	}
	if err := utils.Validate().Struct(login); err != nil {
		utils.RespondFail(w, http.StatusBadRequest, err.Error())
		return
	}
	success, err := a.Database.CheckUserCredentials(model.LoginRequest{
		Email:        email,
		PasswordHash: login.PasswordHash,
	})
	if err != nil {
		utils.RespondError(w, err.Error())
		return
	}
	if !success {
		utils.RespondFail(w, http.StatusOK, "login failed")
		return
	}
	key, err := a.Database.GetAccountEncryptionKey(email)
	if err != nil {
		utils.RespondError(w, err.Error())
		return
	}
	utils.ResponseSuccess(w, model.LoginResponse{
		AccountEncryptionKey: key,
	})
}

func (a *CloudRouter) WhoAmI(w http.ResponseWriter, r *http.Request) {
	_, email := a.whoami(r)
	utils.ResponseSuccess(w, email)
}
