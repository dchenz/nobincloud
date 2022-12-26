package model

type LoginResponse struct {
	AccountEncryptionKey string `json:"account_key"`
}

type FolderContentsResponse struct {
	Files   []File   `json:"files"`
	Folders []Folder `json:"folders"`
}
