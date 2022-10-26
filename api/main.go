package main

import (
	"log"
	"nobincloud/pkg/server"
)

func main() {
	s, err := server.NewServer()
	if err != nil {
		log.Fatal(err)
		return
	}
	if err := s.Start(); err != nil {
		log.Fatal(err)
	}
}
