package database

import (
	"database/sql"
	"fmt"

	"github.com/dchenz/nobincloud/pkg/model/dbmodel"
	"github.com/dchenz/nobincloud/pkg/utils"
)

func (a *Database) getFilesInRootFolder(ownerID int) ([]dbmodel.File, error) {
	q := `SELECT
		  	id,
			public_id,
			owner_id,
			parent_folder_id,
			encryption_key,
			metadata,
			saved_location
		  FROM files
		  WHERE parent_folder_id IS NULL AND owner_id = ?`
	rows, err := a.conn.Query(q, ownerID)
	if err != nil {
		return nil, err
	}
	allFiles := make([]dbmodel.File, 0)
	for rows.Next() {
		var f dbmodel.File
		err := rows.Scan(
			&f.ID,
			&f.PublicID,
			&f.Owner,
			&f.ParentFolder,
			&f.EncryptionKey,
			&f.Metadata,
			&f.SavedLocation,
		)
		if err != nil {
			return nil, err
		}
		allFiles = append(allFiles, f)
	}
	return allFiles, nil
}

func (a *Database) getFilesByParentFolder(folderID int) ([]dbmodel.File, error) {
	q := `SELECT
		  	id,
			public_id,
			owner_id,
			parent_folder_id,
			encryption_key,
			metadata,
			saved_location
		  FROM files
		  WHERE parent_folder_id = ?`
	rows, err := a.conn.Query(q, folderID)
	if err != nil {
		return nil, err
	}
	allFiles := make([]dbmodel.File, 0)
	for rows.Next() {
		var f dbmodel.File
		err := rows.Scan(
			&f.ID,
			&f.PublicID,
			&f.Owner,
			&f.ParentFolder,
			&f.EncryptionKey,
			&f.Metadata,
			&f.SavedLocation,
		)
		if err != nil {
			return nil, err
		}
		allFiles = append(allFiles, f)
	}
	return allFiles, nil
}

func (a *Database) insertFile(file dbmodel.File) error {
	q := `INSERT INTO files (
			public_id,
			owner_id,
			parent_folder_id,
			encryption_key,
			metadata,
			saved_location
	  	  ) VALUES (?, ?, ?, ?, ?, ?);`
	_, err := a.conn.Exec(
		q,
		file.PublicID,
		file.Owner,
		file.ParentFolder,
		file.EncryptionKey,
		file.Metadata,
		file.SavedLocation,
	)
	return err
}

func (a *Database) deleteFiles(fileIDs []int) error {
	q := `DELETE FROM files
		  WHERE id IN (%s);`
	q = fmt.Sprintf(q, utils.Placeholders(len(fileIDs)))
	_, err := a.conn.Exec(q, utils.AnyArray(fileIDs)...)
	return err
}

func (a *Database) getFileOwner(fileID int) (int, error) {
	q := `SELECT owner_id
		  FROM files
		  WHERE id = ?`
	row := a.conn.QueryRow(q, fileID)
	var ownerID int
	err := row.Scan(&ownerID)
	return ownerID, err
}

func (a *Database) updateFilesParentFolder(fileIDs []int, parentFolderID sql.NullInt32) error {
	q := `UPDATE files
		  SET parent_folder_id = ?
		  WHERE id IN (%s)`
	q = fmt.Sprintf(q, utils.Placeholders(len(fileIDs)))
	args := append([]any{parentFolderID}, utils.AnyArray(fileIDs)...)
	_, err := a.conn.Exec(q, args...)
	return err
}
