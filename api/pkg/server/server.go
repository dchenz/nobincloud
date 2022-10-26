package server

import (
	"fmt"
	"log"
	"net/http"
	"nobincloud/pkg/filesdb"
	"nobincloud/pkg/server/loginhandler"
	"time"

	"github.com/gorilla/mux"
)

type Server struct {
	config  ServerConfig
	router  *mux.Router
	filesDB *filesdb.FilesDB
	auth    *loginhandler.AuthRouter
}

func (s *Server) Start() error {
	addr := fmt.Sprintf("%s:%d", s.config.HostName, s.config.Port)
	httpServer := http.Server{
		Handler:           s.router,
		Addr:              addr,
		ReadHeaderTimeout: 3 * time.Second,
	}
	log.Println("server listening at", addr)
	return httpServer.ListenAndServe()
}

func NewServer() (*Server, error) {
	var s Server
	if err := s.loadConfig(); err != nil {
		return nil, err
	}
	s.setupDataStore()

	root := mux.NewRouter()
	api := root.PathPrefix("/api")

	s.auth = loginhandler.NewRouter(s.config.Secret)
	s.auth.RegisterRoutes(api.PathPrefix("/auth").Subrouter())

	return &s, nil
}
