package database

import (
	"errors"
	"fmt"

	"github.com/google/uuid"
)

var ErrDuplicateEmail = errors.New("email already exists")

type ErrFolderNotFound struct {
	ID uuid.UUID
}

func (s *ErrFolderNotFound) Error() string {
	return fmt.Sprintf("folder '%s' not found", s.ID.String())
}
