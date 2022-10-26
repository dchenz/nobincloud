package server

import (
	"database/sql"
	"nobincloud/pkg/filesdb"
)

func (s *Server) setupDataStore() error {
	fdb, err := connectFilesDB(s.config.FilesDBString)
	if err != nil {
		return err
	}
	s.filesDB = fdb
	return nil
}

func connectFilesDB(dbString string) (*filesdb.FilesDB, error) {
	conn, err := sql.Open("mysql", dbString)
	if err != nil {
		return nil, err
	}
	return &filesdb.FilesDB{
		Conn: conn,
	}, nil
}
