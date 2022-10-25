package server

import (
	"fmt"
	"net/http"
	"nobincloud/pkg/server/loginhandler"
	"time"

	"github.com/gorilla/mux"
)

type Server struct {
	router *mux.Router
	auth   *loginhandler.AuthRouter
}

func (s *Server) Start(port int, debugMode bool) {
	hostname := ""
	if debugMode {
		hostname = "localhost"
	}
	addr := fmt.Sprintf("%s:%d", hostname, port)
	httpServer := http.Server{
		Handler:           s.router,
		Addr:              addr,
		ReadHeaderTimeout: 3 * time.Second,
	}
	fmt.Println("server listening at", addr)
	if err := httpServer.ListenAndServe(); err != nil {
		panic(err)
	}
}

func NewServer(secret []byte) *Server {
	root := mux.NewRouter()
	api := root.PathPrefix("/api")

	authRouter := loginhandler.NewRouter(secret)
	authRouter.RegisterRoutes(api.PathPrefix("/auth").Subrouter())

	return &Server{
		router: root,
		auth:   authRouter,
	}
}
