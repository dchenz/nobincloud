package database

import (
	"database/sql"

	"github.com/dchenz/nobincloud/pkg/model/dbmodel"
)

func (a *Database) getFilesByParentFolder(ownerID int, folderID sql.NullInt32) ([]dbmodel.File, error) {
	q := `SELECT
		  	id,
			public_id,
			name,
			owner_id,
			parent_folder_id,
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
			&f.Name,
			&f.Owner,
			&f.ParentFolder,
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
			name,
			owner_id,
			parent_folder_id,
			color
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
			&f.Name,
			&f.Owner,
			&f.ParentFolder,
			&f.Color,
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
			name,
			owner_id,
			parent_folder_id,
			saved_location
	  	  ) VALUES (?, ?, ?, ?, ?);`
	_, err := a.conn.Exec(
		q,
		file.PublicID,
		file.Name,
		file.Owner,
		file.ParentFolder,
		file.SavedLocation,
	)
	return err
}

func (a *Database) insertFolder(folder dbmodel.Folder) error {
	q := `INSERT INTO folders (
			public_id,
			name,
			owner_id,
			parent_folder_id,
			color
		  ) VALUES (?, ?, ?, ?, ?);`
	_, err := a.conn.Exec(
		q,
		folder.PublicID,
		folder.Name,
		folder.Owner,
		folder.ParentFolder,
		folder.Color,
	)
	return err
}