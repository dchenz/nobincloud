package database

import (
	"database/sql"

	"github.com/dchenz/nobincloud/pkg/model"
	"github.com/dchenz/nobincloud/pkg/model/dbmodel"
)

func (a *Database) getFilesByParentFolder(ownerID int, folderID sql.NullInt32) ([]dbmodel.File, error) {
	q := `SELECT
		  	id,
			public_id,
			name,
			owner_id,
			encryption_key,
			parent_folder_id,
			saved_location,
			mimetype
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
			&f.EncryptionKey,
			&f.ParentFolder,
			&f.SavedLocation,
			&f.MimeType,
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
			encryption_key,
			parent_folder_id,
			saved_location,
			thumbnail,
			mimetype
	  	  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`
	_, err := a.conn.Exec(
		q,
		file.PublicID,
		file.Name,
		file.Owner,
		file.EncryptionKey,
		file.ParentFolder,
		file.SavedLocation,
		file.Thumbnail,
		file.MimeType,
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

func (a *Database) getFileThumbnail(ownerID int, fileID int) (model.NullBytes, error) {
	q := `SELECT thumbnail
		  FROM files
		  WHERE owner_id = ? AND id = ?;`
	row := a.conn.QueryRow(q, ownerID, fileID)
	var b model.NullBytes
	err := row.Scan(&b)
	return b, err
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
