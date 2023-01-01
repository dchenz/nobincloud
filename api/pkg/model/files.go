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
	ParentFolder  JSON[uuid.UUID] `json:"parent_folder,omitempty"`
	EncryptionKey Hexadecimal     `json:"file_key"`
	SavedLocation string          `json:"-"`
	Thumbnail     JSON[[]byte]    `json:"-"`
}

type Folder struct {
	ID           uuid.UUID       `json:"id"`
	Name         string          `json:"name"`
	ParentFolder JSON[uuid.UUID] `json:"parent_folder,omitempty"`
	Color        JSON[Color]     `json:"color,omitempty"`
}
