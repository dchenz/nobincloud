package cloudrouter

import (
	"encoding/json"
	"net/http"
	"net/url"
	"strings"

	"github.com/dchenz/nobincloud/pkg/utils"
)

const CaptchaVerifyURL = "https://www.google.com/recaptcha/api/siteverify"

func (a *CloudRouter) authRequired(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if _, email := a.whoami(r); email == "" {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func (a *CloudRouter) whoami(r *http.Request) (int, string) {
	id := a.SessionManager.GetInt(r.Context(), "current_user_id")
	email := a.SessionManager.GetString(r.Context(), "current_user_email")
	return id, email
}

func (a *CloudRouter) captchaRequired(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		captchaToken := r.Header.Get("x-google-captcha")
		if captchaToken == "" {
			utils.RespondFail(w, http.StatusUnauthorized, "bad captcha token")
			return
		}
		form := url.Values{}
		form.Add("secret", a.CaptchaSecret)
		form.Add("response", captchaToken)
		verifyReq, err := http.NewRequest("POST", CaptchaVerifyURL, strings.NewReader(form.Encode()))
		if err != nil {
			utils.RespondError(w, err.Error())
			return
		}
		verifyReq.Header.Add("Content-Type", "application/x-www-form-urlencoded")
		verifyResp, err := http.DefaultClient.Do(verifyReq)
		if err != nil {
			utils.RespondError(w, err.Error())
			return
		}
		defer verifyResp.Body.Close()
		var respBody map[string]any
		if err := json.NewDecoder(verifyResp.Body).Decode(&respBody); err != nil {
			utils.RespondError(w, err.Error())
			return
		}
		ok, exists := respBody["success"]
		if exists && ok == true {
			next.ServeHTTP(w, r)
		} else {
			utils.RespondFail(w, http.StatusUnauthorized, "bad captcha token")
		}
	})
}
