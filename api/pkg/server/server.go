package server

import (
	"fmt"
	"net/http"
	"nobincloud/pkg/logging"
	"nobincloud/pkg/server/cloudrouter"
	"time"

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
	s := Server{
		router: mux.NewRouter(),
	}
	if err := s.loadConfig(); err != nil {
		return nil, err
	}
	ds, err := s.setupDataStore()
	if err != nil {
		return nil, err
	}
	api := s.router.PathPrefix("/api").Subrouter()
	cr := cloudrouter.CloudRouter{
		FilesDB:           ds.Files,
		AccountsDB:        ds.Accounts,
		SessionStore:      ds.Sessions,
		SessionCookieName: "session_token",
	}
	cr.RegisterRoutes(api)
	return &s, nil
}
