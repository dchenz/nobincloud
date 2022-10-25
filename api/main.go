package main

import (
	"nobincloud/pkg/server"
	"nobincloud/pkg/utils"
	"os"
	"strconv"
)

func main() {
	port, err := strconv.Atoi(os.Getenv("GO_PORT"))
	if err != nil {
		port = 5000
	}
	secret, err := utils.ReadBase64Env("GO_SESSION_SECRET")
	if err != nil {
		panic(err)
	}
	s := server.NewServer(secret)
	s.Start(port, os.Getenv("GO_MODE") != "production")
}
