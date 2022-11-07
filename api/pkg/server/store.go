package server

import (
	"database/sql"
	"nobincloud/pkg/accountsdb"
	"nobincloud/pkg/filesdb"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/sessions"
)

type ServerDataStore struct {
	Files    *filesdb.FilesDB
	Accounts *accountsdb.AccountsDB
	Sessions *sessions.CookieStore
}

func (s *Server) setupDataStore() (*ServerDataStore, error) {
	filesConn, err := connectFilesDB(s.config.FilesDBString)
	if err != nil {
		return nil, err
	}
	accountsConn, err := connectAccountsDB(s.config.AccountsDBSting)
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

func connectFilesDB(dbString string) (*filesdb.FilesDB, error) {
	conn, err := sql.Open("mysql", dbString)
	if err != nil {
		return nil, err
	}
	return &filesdb.FilesDB{
		Conn: conn,
	}, nil
}

func connectAccountsDB(dbString string) (*accountsdb.AccountsDB, error) {
	conn, err := sql.Open("mysql", dbString)
	if err != nil {
		return nil, err
	}
	return &accountsdb.AccountsDB{
		Conn: conn,
	}, nil
}
