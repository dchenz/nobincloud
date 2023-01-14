package model

import (
	"github.com/google/uuid"
)

type FileRef struct {
	ID uuid.UUID `json:"id"`
}

type File struct {
	ID            uuid.UUID       `json:"id"`
	EncryptionKey Bytes           `json:"encryptionKey"`
	ParentFolder  JSON[uuid.UUID] `json:"parentFolder,omitempty"`
	Metadata      Bytes           `json:"metadata"`
	SavedLocation string          `json:"-"`
}

type Folder struct {
	ID            uuid.UUID       `json:"id"`
	EncryptionKey Bytes           `json:"encryptionKey"`
	ParentFolder  JSON[uuid.UUID] `json:"parentFolder,omitempty"`
	Metadata      Bytes           `json:"metadata"`
}
