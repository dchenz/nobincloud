package server

import (
	"context"

	"github.com/sethvargo/go-envconfig"
)

type ServerConfig struct {
	HostName      string `env:"SERVER_HOSTNAME,default=localhost"`
	Port          int    `env:"SERVER_PORT,default=5000"`
	Secret        []byte `env:"SERVER_SECRET,required"`
	DSN           string `env:"MYSQL_DB,required"`
	DataStorePath string `env:"DATA_STORE_PATH,required"`
	CaptchaSecret string `env:"GOOGLE_CAPTCHA_SECRET,required"`
}

func loadConfig() (*ServerConfig, error) {
	var cfg ServerConfig
	err := envconfig.Process(context.Background(), &cfg)
	if err != nil {
		return nil, err
	}
	return &cfg, nil
}
