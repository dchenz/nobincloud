package database

import (
	"database/sql"

	"github.com/dchenz/nobincloud/pkg/model"
	"github.com/dchenz/nobincloud/pkg/model/dbmodel"
	"github.com/google/uuid"
)

func (a *Database) GetFilesInFolder(userID int, folder uuid.UUID) ([]model.File, error) {
	folderID, err := a.sqlFolderID(folder)
	if err != nil {
		return nil, err
	}
	dbFiles, err := a.getFilesByParentFolder(userID, folderID)
	if err != nil {
		return nil, err
	}
	res := make([]model.File, 0)
	for _, dbFile := range dbFiles {
		id, err := uuid.FromBytes(dbFile.PublicID)
		if err != nil {
			return nil, err
		}
		f := model.File{
			ID:   id,
			Name: model.Hexadecimal{Bytes: dbFile.Name},
			ParentFolder: model.JSON[uuid.UUID]{
				Valid: dbFile.ParentFolder.Valid,
				Value: folder,
			},
			SavedLocation: dbFile.SavedLocation,
		}
		res = append(res, f)
	}
	return res, nil
}

func (a *Database) GetFoldersInFolder(userID int, folder uuid.UUID) ([]model.Folder, error) {
	folderID, err := a.sqlFolderID(folder)
	if err != nil {
		return nil, err
	}
	dbFolders, err := a.getFoldersByParentFolder(userID, folderID)
	if err != nil {
		return nil, err
	}
	res := make([]model.Folder, 0)
	for _, dbFolder := range dbFolders {
		id, err := uuid.FromBytes(dbFolder.PublicID)
		if err != nil {
			return nil, err
		}
		d := model.Folder{
			ID:   id,
			Name: dbFolder.Name,
			ParentFolder: model.JSON[uuid.UUID]{
				Valid: dbFolder.ParentFolder.Valid,
				Value: folder,
			},
			Color: model.JSON[model.Color]{
				Valid: dbFolder.Color.Valid,
				Value: model.Color(dbFolder.Color.Int32),
			},
		}
		res = append(res, d)
	}
	return res, nil
}

func (a *Database) CreateFile(userID int, file model.File) error {
	folderID, err := a.sqlFolderID(file.ParentFolder.Value)
	if err != nil {
		return err
	}
	return a.insertFile(dbmodel.File{
		PublicID:      file.ID[:],
		Name:          file.Name.Bytes,
		Owner:         userID,
		ParentFolder:  folderID,
		SavedLocation: file.SavedLocation,
		Thumbnail: model.NullBytes{
			Valid: file.Thumbnail.Valid,
			Bytes: file.Thumbnail.Value,
		},
	})
}

func (a *Database) CreateFolder(userID int, folder model.Folder) error {
	folderID, err := a.sqlFolderID(folder.ParentFolder.Value)
	if err != nil {
		return err
	}
	return a.insertFolder(dbmodel.Folder{
		PublicID:     folder.ID[:],
		Name:         folder.Name,
		Owner:        userID,
		ParentFolder: folderID,
		Color: sql.NullInt32{
			Valid: folder.Color.Valid,
			Int32: int32(folder.Color.Value),
		},
	})
}

func (a *Database) GetThumbnail(userID int, file uuid.UUID) ([]byte, error) {
	fileID, err := a.findFileID(file[:])
	if err != nil {
		return nil, err
	}
	thumbnail, err := a.getFileThumbnail(userID, fileID)
	if err != nil {
		return nil, err
	}
	if !thumbnail.Valid {
		return nil, nil
	}
	return thumbnail.Bytes, nil
}
