package server

import (
	"context"

	"github.com/sethvargo/go-envconfig"
)

type ServerConfig struct {
	HostName      string `env:"SERVER_HOSTNAME,default=localhost"`
	Port          int    `env:"SERVER_PORT,default=5000"`
	Secret        []byte `env:"SERVER_SECRET,required"`
	FilesDBString string `env:"FILES_DB_CONNECTION_STRING,required"`
}

func (s *Server) loadConfig() error {
	err := envconfig.Process(context.Background(), &s.config)
	if err != nil {
		return err
	}
	return nil
}
