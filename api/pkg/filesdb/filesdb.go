package filesdb

import "database/sql"

type FilesDB struct {
	Conn *sql.DB
}
