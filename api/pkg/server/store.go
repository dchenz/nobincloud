package server

import (
	"nobincloud/pkg/accountsdb"
	"nobincloud/pkg/filesdb"
)

type ServerDataStore struct {
	Files    *filesdb.FilesDB
	Accounts *accountsdb.AccountsDB
}

func (s *Server) setupDataStore() (*ServerDataStore, error) {
	filesConn, err := filesdb.NewFilesDB(s.config.filesDBString)
	if err != nil {
		return nil, err
	}
	accountsConn, err := accountsdb.NewAccountsDB(s.config.accountsDBSting)
	if err != nil {
		return nil, err
	}
	return &ServerDataStore{
		Files:    filesConn,
		Accounts: accountsConn,
	}, nil
}
