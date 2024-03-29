package utils

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"os"
	"strings"
	"time"
)

func TimeNow() time.Time {
	return time.Now().UTC()
}

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

func RandomBytes(n int) ([]byte, error) {
	b := make([]byte, n)
	if _, err := rand.Read(b); err != nil {
		return nil, err
	}
	return b, nil
}

func Placeholders(n int) string {
	s := make([]string, 0)
	for i := 0; i < n; i++ {
		s = append(s, "?")
	}
	return strings.Join(s, ",")
}

func AnyArray[T any](items []T) []any {
	s := make([]any, 0)
	for _, v := range items {
		s = append(s, v)
	}
	return s
}
