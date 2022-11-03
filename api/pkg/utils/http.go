package utils

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"nobincloud/pkg/logging"
	"nobincloud/pkg/model"

	"github.com/go-playground/validator/v10"
)

var _validate *validator.Validate

func Validate() *validator.Validate {
	if _validate == nil {
		_validate = validator.New()
	}
	return _validate
}

func GetBody(r *http.Request, dest interface{}) error {
	err := json.NewDecoder(r.Body).Decode(dest)
	if err == io.EOF {
		return fmt.Errorf("request body is required")
	}
	return err
}

func ResponseSuccess(w http.ResponseWriter, data interface{}) {
	w.Header().Add("Content-Type", "application/json")
	err := json.NewEncoder(w).Encode(model.Response{
		Success: true,
		Data:    data,
	})
	if err != nil {
		logging.Error("Cannot JSON encode in ResponseSuccess")
	}
}

func RespondFail(w http.ResponseWriter, status int, reason string) {
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(status)
	err := json.NewEncoder(w).Encode(model.Response{
		Success: false,
		Data:    reason,
	})
	if err != nil {
		logging.Error("Cannot JSON decode in RespondFail")
	}
}

func RespondError(w http.ResponseWriter, reason string) {
	RespondFail(w, http.StatusInternalServerError,
		"Something went wrong on the server...")
	logging.Error("[500] %s", reason)
}