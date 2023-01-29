package database

import (
	"database/sql"
	"fmt"

	"github.com/dchenz/nobincloud/pkg/errors"
	"github.com/dchenz/nobincloud/pkg/model"
	"github.com/dchenz/nobincloud/pkg/model/dbmodel"
	"github.com/google/uuid"
)

func (a *Database) ResolveFolderID(userID int, folderUUID uuid.UUID) (int, error) {
	id, err := a.findFolderID(folderUUID)
	if err != nil {
		return 0, err
	}
	ownerID, err := a.getFolderOwner(id)
	if err != nil {
		return 0, err
	}
	if userID != ownerID {
		return 0, errors.ErrNotAuthorized
	}
	return id, nil
}

func (a *Database) GetFoldersInFolder(userID int, folderUUID uuid.UUID, root bool) ([]model.Folder, error) {
	var dbFolders []dbmodel.Folder
	if root {
		folders, err := a.getFoldersInRootFolder(userID)
		if err != nil {
			return nil, err
		}
		dbFolders = folders
	} else {
		id, err := a.ResolveFolderID(userID, folderUUID)
		if err != nil {
			return nil, err
		}
		folders, err := a.getFoldersByParentFolder(id)
		if err != nil {
			return nil, err
		}
		dbFolders = folders
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
				Valid: !root,
				Value: folderUUID,
			},
			EncryptionKey: model.Bytes{Bytes: dbFolder.EncryptionKey},
			Metadata:      model.Bytes{Bytes: dbFolder.Metadata},
		}
		res = append(res, d)
	}
	return res, nil
}

func (a *Database) GetFolder(userID int, folderUUID uuid.UUID) (*model.Folder, error) {
	folderID, err := a.ResolveFolderID(userID, folderUUID)
	if err != nil {
		return nil, err
	}
	f, err := a.getFolder(folderID)
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
		ID:            folderUUID,
		ParentFolder:  parentFolder,
		EncryptionKey: model.Bytes{Bytes: f.EncryptionKey},
		Metadata:      model.Bytes{Bytes: f.Metadata},
	}, nil
}

func (a *Database) CreateFolder(userID int, folder model.Folder) error {
	var sqlFolderID sql.NullInt32
	if folder.ParentFolder.Valid {
		id, err := a.ResolveFolderID(userID, folder.ParentFolder.Value)
		if err != nil {
			return err
		}
		sqlFolderID.Valid = true
		sqlFolderID.Int32 = int32(id)
	}
	return a.insertFolder(dbmodel.Folder{
		PublicID:      folder.ID[:],
		Owner:         userID,
		ParentFolder:  sqlFolderID,
		EncryptionKey: folder.EncryptionKey.Bytes,
		Metadata:      folder.Metadata.Bytes,
	})
}

func (a *Database) DeleteFolders(userID int, folderUUIDs []uuid.UUID) error {
	folderIDs := make([]int, 0)
	for _, folderUUID := range folderUUIDs {
		folderID, err := a.ResolveFolderID(userID, folderUUID)
		if err != nil {
			return err
		}
		folderIDs = append(folderIDs, folderID)
	}
	return a.deleteFolders(folderIDs)
}

func (a *Database) MoveFolders(userID int, folderUUIDs []uuid.UUID, intoFolder uuid.UUID, root bool) error {
	var intoFolderID sql.NullInt32
	if !root {
		folderID, err := a.ResolveFolderID(userID, intoFolder)
		if err != nil {
			return err
		}
		intoFolderID.Valid = true
		intoFolderID.Int32 = int32(folderID)
	}
	folderIDs := make([]int, 0)
	for _, folderUUID := range folderUUIDs {
		folderID, err := a.ResolveFolderID(userID, folderUUID)
		if err != nil {
			return err
		}
		folderIDs = append(folderIDs, folderID)
	}
	if intoFolderID.Valid {
		ancestorContains, err := a.getAncestors(int(intoFolderID.Int32))
		if err != nil {
			return err
		}
		for _, folderID := range folderIDs {
			// Moving folder into itself is not allowed.
			if folderID == int(intoFolderID.Int32) {
				return fmt.Errorf("cannot perform this move action")
			}
			// Moving folder into a subfolder is not allowed.
			if _, exists := ancestorContains[folderID]; exists {
				return fmt.Errorf("cannot perform this move action")
			}
		}
	}
	return a.updateFoldersParentFolder(folderIDs, intoFolderID)
}
