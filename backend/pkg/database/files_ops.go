package database

import (
	"database/sql"

	"github.com/dchenz/nobincloud/pkg/model/dbmodel"
)

func (a *Database) getFilesByParentFolder(ownerID int, folderID sql.NullInt32) ([]dbmodel.File, error) {
	q := `SELECT
		  	id,
			public_id,
			owner_id,
			parent_folder_id,
			encryption_key,
			metadata,
			saved_location
		  FROM files
		  WHERE owner_id = ?`
	var rows *sql.Rows
	var err error
	if folderID.Valid {
		q += " AND parent_folder_id = ?"
		rows, err = a.conn.Query(q, ownerID, folderID)
	} else {
		q += " AND parent_folder_id IS NULL"
		rows, err = a.conn.Query(q, ownerID)
	}
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

func (a *Database) getFoldersByParentFolder(ownerID int, folderID sql.NullInt32) ([]dbmodel.Folder, error) {
	q := `SELECT
			id,
			public_id,
			owner_id,
			parent_folder_id,
			encryption_key,
			metadata
		  FROM folders
		  WHERE owner_id = ?`
	var rows *sql.Rows
	var err error
	if folderID.Valid {
		q += " AND parent_folder_id = ?"
		rows, err = a.conn.Query(q, ownerID, folderID)
	} else {
		q += " AND parent_folder_id IS NULL"
		rows, err = a.conn.Query(q, ownerID)
	}
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

func (a *Database) getFileOwner(fileID int) (int, error) {
	q := `SELECT owner_id
		  FROM files
		  WHERE id = ?;`
	row := a.conn.QueryRow(q, fileID)
	var ownerID int
	err := row.Scan(&ownerID)
	return ownerID, err
}

func (a *Database) deleteFile(ownerID int, fileID int) error {
	q := `DELETE FROM files
		  WHERE owner_id = ? AND id = ?;`
	_, err := a.conn.Exec(q, ownerID, fileID)
	return err
}

func (a *Database) getFolder(ownerID int, folderID int) (dbmodel.Folder, error) {
	q := `SELECT
			id,
			public_id,
			owner_id,
			parent_folder_id,
			encryption_key,
			metadata
		  FROM folders
		  WHERE owner_id = ? AND id = ?;`
	row := a.conn.QueryRow(q, ownerID, folderID)
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

func (a *Database) updateFolder(folder dbmodel.Folder) error {
	q := `UPDATE folders
	      SET encryption_key = ?,
		  	  metadata = ?,
		      parent_folder_id = ?
		  WHERE owner_id = ? AND id = ?;`
	_, err := a.conn.Exec(
		q,
		folder.EncryptionKey,
		folder.Metadata,
		folder.ParentFolder,
		folder.Owner,
		folder.ID,
	)
	return err
}
