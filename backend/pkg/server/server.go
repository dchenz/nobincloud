package server

import (
	"fmt"
	"net/http"
	"time"

	"github.com/dchenz/nobincloud/pkg/database"
	"github.com/dchenz/nobincloud/pkg/filestore"
	"github.com/dchenz/nobincloud/pkg/logging"
	"github.com/dchenz/nobincloud/pkg/server/cloudrouter"

	"github.com/alexedwards/scs/v2"
	"github.com/gorilla/mux"
)

type Server struct {
	Hostname string
	Port     int
	router   *mux.Router
}

func (s *Server) Start() error {
	addr := fmt.Sprintf("%s:%d", s.Hostname, s.Port)
	httpServer := http.Server{
		Handler:           s.router,
		Addr:              addr,
		ReadHeaderTimeout: 3 * time.Second,
	}
	logging.Log("server listening at %s", addr)
	return httpServer.ListenAndServe()
}

func NewServer() (*Server, error) {
	r := mux.NewRouter()
	sessionMgr := scs.New()
	serverConfig, err := loadConfig()
	if err != nil {
		return nil, err
	}
	db, err := database.NewDatabase(serverConfig.DSN)
	if err != nil {
		return nil, err
	}
	api := r.PathPrefix("/api").Subrouter()
	cr := cloudrouter.CloudRouter{
		Database:       db,
		SessionManager: sessionMgr,
		Files: &filestore.FileStore{
			Path: serverConfig.DataStorePath,
		},
		CaptchaSecret: serverConfig.CaptchaSecret,
		DevMode:       serverConfig.DevMode,
	}
	cr.RegisterRoutes(api)
	api.Use(sessionMgr.LoadAndSave)
	s := Server{
		Hostname: serverConfig.HostName,
		Port:     serverConfig.Port,
		router:   r,
	}
	return &s, nil
}
