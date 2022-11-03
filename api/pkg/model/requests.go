package model

type Response struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
}

// WrappedKey is an AES256 key encrypted with AES-GCM,
// which has the same length as a SHA256 digest.
type NewUserRequest struct {
	Email        string `json:"email" validate:"required,email"`
	Nickname     string `json:"nickname" validate:"required"`
	PasswordHash string `json:"password_hash" validate:"required,sha512"`
	WrappedKey   string `json:"wrapped_key" validate:"required,hexadecimal"`
}

type LoginRequest struct {
	Email        string `json:"email" validate:"required,email"`
	PasswordHash string `json:"password_hash" validate:"required,sha512"`
}
