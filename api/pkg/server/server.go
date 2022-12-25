package server

import (
	"fmt"
	"net/http"
	"nobincloud/pkg/logging"
	"nobincloud/pkg/server/cloudrouter"
	"nobincloud/pkg/usersdb"
	"time"

	"github.com/alexedwards/scs/v2"
	"github.com/gorilla/mux"
)

type Server struct {
	config ServerConfig
	router *mux.Router
}

func (s *Server) Start() error {
	addr := fmt.Sprintf("%s:%d", s.config.HostName, s.config.Port)
	httpServer := http.Server{
		Handler:           s.router,
		Addr:              addr,
		ReadHeaderTimeout: 3 * time.Second,
	}
	logging.Log("server listening at %s", addr)
	return httpServer.ListenAndServe()
}

func NewServer() (*Server, error) {
	s := &Server{
		router: mux.NewRouter(),
	}
	sessionMgr := scs.New()
	if err := s.loadConfig(); err != nil {
		return nil, err
	}
	db, err := usersdb.NewUsersDB(s.config.DSN)
	if err != nil {
		return nil, err
	}
	api := s.router.PathPrefix("/api").Subrouter()
	cr := cloudrouter.CloudRouter{
		UsersDB:        db,
		SessionManager: sessionMgr,
	}
	cr.RegisterRoutes(api)
	api.Use(sessionMgr.LoadAndSave)
	return s, nil
}
