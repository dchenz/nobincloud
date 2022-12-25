package filesdb

import "database/sql"

type FilesDB struct {
	conn *sql.DB
}

func NewFilesDB(dbString string) (*FilesDB, error) {
	conn, err := sql.Open("mysql", dbString)
	if err != nil {
		return nil, err
	}
	return &FilesDB{
		conn: conn,
	}, nil
}
