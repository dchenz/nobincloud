package model

import "github.com/google/uuid"

type Response struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
}

// WrappedKey is an AES256 key encrypted with AES-GCM,
// which has the same length as a SHA256 digest.
type NewUserRequest struct {
	Email                string `json:"email" validate:"required,email"`
	Nickname             string `json:"nickname" validate:"required"`
	PasswordHash         string `json:"passwordHash" validate:"required,base64"`
	AccountEncryptionKey string `json:"accountKey" validate:"required,base64"`
}

type LoginRequest struct {
	Email        string `json:"email" validate:"required,email"`
	PasswordHash string `json:"passwordHash" validate:"required,base64"`
}

type LockedLoginRequest struct {
	PasswordHash string `json:"passwordHash" validate:"required,base64"`
}

type FolderContentsRequest struct {
	Files   []uuid.UUID `json:"files"`
	Folders []uuid.UUID `json:"folders"`
}
