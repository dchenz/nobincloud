package model

type LoginResponse struct {
	AccountEncryptionKey string `json:"accountKey"`
}

type FolderContentsResponse struct {
	Files   []File   `json:"files"`
	Folders []Folder `json:"folders"`
}
