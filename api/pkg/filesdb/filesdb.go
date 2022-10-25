package filesdb

type FilesDB interface {
	CreateFile(name string, user string) (string, error)
	GetFile(id string) (string, error)
}
