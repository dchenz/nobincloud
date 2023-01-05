package model

import (
	"github.com/google/uuid"
)

type FileRef struct {
	ID uuid.UUID `json:"id"`
}

type File struct {
	ID            uuid.UUID       `json:"id"`
	Name          Bytes           `json:"name"`
	ParentFolder  JSON[uuid.UUID] `json:"parentFolder,omitempty"`
	EncryptionKey Bytes           `json:"fileKey"`
	SavedLocation string          `json:"-"`
	Thumbnail     JSON[[]byte]    `json:"-"`
	MimeType      string          `json:"mimetype"`
}

type Folder struct {
	ID           uuid.UUID       `json:"id"`
	Name         string          `json:"name"`
	ParentFolder JSON[uuid.UUID] `json:"parentFolder,omitempty"`
}
