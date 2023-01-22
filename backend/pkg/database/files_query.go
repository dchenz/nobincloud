package database

import (
	"database/sql"

	"github.com/dchenz/nobincloud/pkg/errors"
	"github.com/dchenz/nobincloud/pkg/model"
	"github.com/dchenz/nobincloud/pkg/model/dbmodel"
	"github.com/google/uuid"
)

func (a *Database) ResolveFileID(userID int, fileUUID uuid.UUID) (int, error) {
	id, err := a.findFileID(fileUUID)
	if err != nil {
		return 0, err
	}
	ownerID, err := a.getFileOwner(id)
	if err != nil {
		return 0, err
	}
	if userID != ownerID {
		return 0, errors.ErrNotAuthorized
	}
	return id, nil
}

func (a *Database) GetFilesInFolder(userID int, folderUUID uuid.UUID, root bool) ([]model.File, error) {
	var dbFiles []dbmodel.File
	if root {
		files, err := a.getFilesInRootFolder(userID)
		if err != nil {
			return nil, err
		}
		dbFiles = files
	} else {
		id, err := a.ResolveFolderID(userID, folderUUID)
		if err != nil {
			return nil, err
		}
		files, err := a.getFilesByParentFolder(id)
		if err != nil {
			return nil, err
		}
		dbFiles = files
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
				Valid: !root,
				Value: folderUUID,
			},
			Metadata:      model.Bytes{Bytes: dbFile.Metadata},
			SavedLocation: dbFile.SavedLocation,
		}
		res = append(res, f)
	}
	return res, nil
}

func (a *Database) CreateFile(userID int, file model.File) error {
	var sqlFolderID sql.NullInt32
	if file.ParentFolder.Valid {
		id, err := a.ResolveFolderID(userID, file.ParentFolder.Value)
		if err != nil {
			return err
		}
		sqlFolderID.Valid = true
		sqlFolderID.Int32 = int32(id)
	}
	return a.insertFile(dbmodel.File{
		PublicID:      file.ID[:],
		Owner:         userID,
		ParentFolder:  sqlFolderID,
		EncryptionKey: file.EncryptionKey.Bytes,
		Metadata:      file.Metadata.Bytes,
		SavedLocation: file.SavedLocation,
	})
}

func (a *Database) DeleteFiles(userID int, fileUUIDs []uuid.UUID) error {
	fileIDs := make([]int, 0)
	for _, fileUUID := range fileUUIDs {
		fileID, err := a.ResolveFileID(userID, fileUUID)
		if err != nil {
			return err
		}
		fileIDs = append(fileIDs, fileID)
	}
	return a.deleteFiles(fileIDs)
}

func (a *Database) GetFileOwner(fileUUID uuid.UUID) (int, error) {
	fileID, err := a.findFileID(fileUUID)
	if err != nil {
		return 0, err
	}
	return a.getFileOwner(fileID)
}
