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
			EncryptionKey: model.Bytes{Bytes: dbFile.EncryptionKey},
			ParentFolder: model.JSON[uuid.UUID]{
				Valid: dbFile.ParentFolder.Valid,
				Value: folder,
			},
			Metadata:      model.Bytes{Bytes: dbFile.Metadata},
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
			ID: id,
			ParentFolder: model.JSON[uuid.UUID]{
				Valid: dbFolder.ParentFolder.Valid,
				Value: folder,
			},
			EncryptionKey: model.Bytes{Bytes: dbFolder.EncryptionKey},
			Metadata:      model.Bytes{Bytes: dbFolder.Metadata},
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
		Owner:         userID,
		ParentFolder:  folderID,
		EncryptionKey: file.EncryptionKey.Bytes,
		Metadata:      file.Metadata.Bytes,
		SavedLocation: file.SavedLocation,
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
			PublicID:      folder.ID[:],
			Owner:         userID,
			ParentFolder:  parentFolderID,
			EncryptionKey: folder.EncryptionKey.Bytes,
			Metadata:      folder.Metadata.Bytes,
		})
	}
	if err != nil {
		return err
	}
	updatedFolder := dbmodel.Folder{
		ID:            int(existingFolderID.Int32),
		PublicID:      folder.ID[:],
		Owner:         userID,
		ParentFolder:  parentFolderID,
		EncryptionKey: folder.EncryptionKey.Bytes,
		Metadata:      folder.Metadata.Bytes,
	}
	return a.updateFolder(updatedFolder)
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
		ID:            folder,
		ParentFolder:  parentFolder,
		EncryptionKey: model.Bytes{Bytes: f.EncryptionKey},
		Metadata:      model.Bytes{Bytes: f.Metadata},
	}, nil
}
