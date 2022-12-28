package server

import (
	"fmt"
	"net/http"
	"time"

	"github.com/dchenz/go-assemble"
	"github.com/dchenz/nobincloud/pkg/database"
	"github.com/dchenz/nobincloud/pkg/filestore"
	"github.com/dchenz/nobincloud/pkg/logging"
	"github.com/dchenz/nobincloud/pkg/server/cloudrouter"

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
	db, err := database.NewDatabase(s.config.DSN)
	if err != nil {
		return nil, err
	}
	api := s.router.PathPrefix("/api").Subrouter()
	cr := cloudrouter.CloudRouter{
		Database:       db,
		SessionManager: sessionMgr,
		Files: &filestore.FileStore{
			Path: s.config.DataStorePath,
		},
		UploadManager: assemble.NewFileChunksAssembler(nil),
	}
	cr.RegisterRoutes(api)
	api.Use(sessionMgr.LoadAndSave)
	return s, nil
}
