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
			ID:            id,
			Name:          model.Bytes{Bytes: dbFile.Name},
			EncryptionKey: model.Bytes{Bytes: dbFile.EncryptionKey},
			ParentFolder: model.JSON[uuid.UUID]{
				Valid: dbFile.ParentFolder.Valid,
				Value: folder,
			},
			SavedLocation: dbFile.SavedLocation,
			MimeType:      dbFile.MimeType,
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
		EncryptionKey: file.EncryptionKey.Bytes,
		SavedLocation: file.SavedLocation,
		Thumbnail: model.NullBytes{
			Valid: file.Thumbnail.Valid,
			Bytes: file.Thumbnail.Value,
		},
		MimeType: file.MimeType,
	})
}

func (a *Database) UpsertFolder(userID int, folder model.Folder) error {
	parentFolderID, err := a.sqlFolderID(folder.ParentFolder.Value)
	if err != nil {
		return err
	}
	existingFolderID, err := a.sqlFolderID(folder.ID)
	if err == sql.ErrNoRows {
		return a.insertFolder(dbmodel.Folder{
			PublicID:     folder.ID[:],
			Name:         folder.Name,
			Owner:        userID,
			ParentFolder: parentFolderID,
		})
	}
	if err != nil {
		return err
	}
	updatedFolder := dbmodel.Folder{
		ID:           int(existingFolderID.Int32),
		PublicID:     folder.ID[:],
		Name:         folder.Name,
		Owner:        userID,
		ParentFolder: parentFolderID,
	}
	return a.updateFolder(updatedFolder)
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

func (a *Database) GetFileOwner(file uuid.UUID) (int, error) {
	fileID, err := a.findFileID(file[:])
	if err != nil {
		return 0, err
	}
	return a.getFileOwner(fileID)
}

func (a *Database) DeleteFile(userID int, file uuid.UUID) error {
	fileID, err := a.findFileID(file[:])
	if err != nil {
		return err
	}
	return a.deleteFile(userID, fileID)
}

func (a *Database) GetFolder(userID int, folder uuid.UUID) (*model.Folder, error) {
	folderID, err := a.sqlFolderID(folder)
	if err != nil {
		return nil, err
	}
	if !folderID.Valid {
		return nil, &ErrFolderNotFound{ID: folder}
	}
	f, err := a.getFolder(userID, int(folderID.Int32))
	if err != nil {
		return nil, err
	}
	var parentFolder model.JSON[uuid.UUID]
	if f.ParentFolder.Valid {
		pf, err := a.findFolderUUID(int(f.ParentFolder.Int32))
		if err != nil {
			return nil, err
		}
		parentFolder.Valid = true
		parentFolder.Value = pf
	}
	return &model.Folder{
		ID:           folder,
		Name:         f.Name,
		ParentFolder: parentFolder,
	}, nil
}
