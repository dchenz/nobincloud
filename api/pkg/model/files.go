package model

import (
	"github.com/google/uuid"
)

type FileRef struct {
	ID uuid.UUID `json:"id"`
}

type File struct {
	ID            uuid.UUID       `json:"id"`
	Name          Hexadecimal     `json:"name"`
	ParentFolder  JSON[uuid.UUID] `json:"parentFolder,omitempty"`
	EncryptionKey Hexadecimal     `json:"fileKey"`
	SavedLocation string          `json:"-"`
	Thumbnail     JSON[[]byte]    `json:"-"`
	MimeType      string          `json:"mimetype"`
}

type Folder struct {
	ID           uuid.UUID       `json:"id"`
	Name         string          `json:"name"`
	ParentFolder JSON[uuid.UUID] `json:"parentFolder,omitempty"`
	Color        JSON[Color]     `json:"color,omitempty"`
}
