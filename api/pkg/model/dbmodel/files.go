package dbmodel

import (
	"database/sql"

	"github.com/dchenz/nobincloud/pkg/model"
)

type File struct {
	ID            int
	PublicID      []byte
	Name          []byte
	Owner         int
	ParentFolder  sql.NullInt32
	EncryptionKey []byte
	SavedLocation string
	Thumbnail     model.NullBytes
}

type Folder struct {
	ID           int
	PublicID     []byte
	Name         string
	Owner        int
	ParentFolder sql.NullInt32
	Color        sql.NullInt32
}
