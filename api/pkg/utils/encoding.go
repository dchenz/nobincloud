package utils

import (
	"encoding/base64"
	"fmt"
	"os"
)

func ReadBase64Env(name string) ([]byte, error) {
	value, exists := os.LookupEnv(name)
	if !exists {
		return nil, fmt.Errorf("missing environment variable '%s'", name)
	}
	valueBytes, err := base64.StdEncoding.DecodeString(value)
	if err != nil {
		return nil, err
	}
	return valueBytes, nil
}
