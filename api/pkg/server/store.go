package server

import (
	"nobincloud/pkg/accountsdb"
	"nobincloud/pkg/filesdb"

	"github.com/gorilla/sessions"
)

type ServerDataStore struct {
	Files    *filesdb.FilesDB
	Accounts *accountsdb.AccountsDB
	Sessions *sessions.CookieStore
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
		Sessions: createSessionStore(s.config.Secret),
	}, nil
}

func createSessionStore(secret []byte) *sessions.CookieStore {
	cs := sessions.NewCookieStore(secret)
	cs.Options.HttpOnly = true
	cs.Options.Secure = true
	cs.Options.MaxAge = 0
	return cs
}
