package database

import (
	"fmt"

	"github.com/dchenz/nobincloud/pkg/model/dbmodel"
	"github.com/dchenz/nobincloud/pkg/utils"
)

func (a *Database) getFoldersInRootFolder(ownerID int) ([]dbmodel.Folder, error) {
	q := `SELECT
			id,
			public_id,
			owner_id,
			parent_folder_id,
			encryption_key,
			metadata
		  FROM folders
		  WHERE parent_folder_id IS NULL AND owner_id = ?`
	rows, err := a.conn.Query(q, ownerID)
	if err != nil {
		return nil, err
	}
	allFolders := make([]dbmodel.Folder, 0)
	for rows.Next() {
		var f dbmodel.Folder
		err := rows.Scan(
			&f.ID,
			&f.PublicID,
			&f.Owner,
			&f.ParentFolder,
			&f.EncryptionKey,
			&f.Metadata,
		)
		if err != nil {
			return nil, err
		}
		allFolders = append(allFolders, f)
	}
	return allFolders, nil
}

func (a *Database) getFoldersByParentFolder(folderID int) ([]dbmodel.Folder, error) {
	q := `SELECT
			id,
			public_id,
			owner_id,
			parent_folder_id,
			encryption_key,
			metadata
		  FROM folders
		  WHERE parent_folder_id = ?`
	rows, err := a.conn.Query(q, folderID)
	if err != nil {
		return nil, err
	}
	allFolders := make([]dbmodel.Folder, 0)
	for rows.Next() {
		var f dbmodel.Folder
		err := rows.Scan(
			&f.ID,
			&f.PublicID,
			&f.Owner,
			&f.ParentFolder,
			&f.EncryptionKey,
			&f.Metadata,
		)
		if err != nil {
			return nil, err
		}
		allFolders = append(allFolders, f)
	}
	return allFolders, nil
}

func (a *Database) getFolder(folderID int) (dbmodel.Folder, error) {
	q := `SELECT
			id,
			public_id,
			owner_id,
			parent_folder_id,
			encryption_key,
			metadata
		  FROM folders
		  WHERE id = ?;`
	row := a.conn.QueryRow(q, folderID)
	var f dbmodel.Folder
	err := row.Scan(
		&f.ID,
		&f.PublicID,
		&f.Owner,
		&f.ParentFolder,
		&f.EncryptionKey,
		&f.Metadata,
	)
	return f, err
}

func (a *Database) insertFolder(folder dbmodel.Folder) error {
	q := `INSERT INTO folders (
			public_id,
			owner_id,
			parent_folder_id,
			encryption_key,
			metadata
	  	  ) VALUES (?, ?, ?, ?, ?);`
	_, err := a.conn.Exec(
		q,
		folder.PublicID,
		folder.Owner,
		folder.ParentFolder,
		folder.EncryptionKey,
		folder.Metadata,
	)
	return err
}

func (a *Database) getFolderOwner(folderID int) (int, error) {
	q := `SELECT owner_id
		  FROM folders
		  WHERE id = ?`
	row := a.conn.QueryRow(q, folderID)
	var ownerID int
	err := row.Scan(&ownerID)
	return ownerID, err
}

func (a *Database) deleteFolders(folderIDs []int) error {
	q := `DELETE FROM folders
		  WHERE id IN (%s)`
	q = fmt.Sprintf(q, utils.Placeholders(len(folderIDs)))
	_, err := a.conn.Exec(q, utils.AnyArray(folderIDs)...)
	return err
}
