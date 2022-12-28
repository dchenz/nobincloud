package filestore

import (
	"io"
	"os"
	"path/filepath"

	"github.com/google/uuid"
)

type FileStore struct {
	Path string
}

func (a *FileStore) Load(id uuid.UUID) (io.ReadCloser, error) {
	return os.Open(a.idToPath(id))
}

func (a *FileStore) Save(id uuid.UUID, b io.ReadCloser) (string, error) {
	filePath := a.idToPath(id)
	f, err := os.Create(filePath)
	if err != nil {
		return "", err
	}
	_, err = io.Copy(f, b)
	return filePath, err
}

func (a *FileStore) Delete(id uuid.UUID) error {
	return os.Remove(a.idToPath(id))
}

func (a *FileStore) idToPath(id uuid.UUID) string {
	return filepath.Join(a.Path, id.String())
}
