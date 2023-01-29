package database

import (
	"database/sql"
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

func (a *Database) updateFoldersParentFolder(folderIDs []int, parentFolderID sql.NullInt32) error {
	q := `UPDATE folders
		  SET parent_folder_id = ?
		  WHERE id IN (%s)`
	q = fmt.Sprintf(q, utils.Placeholders(len(folderIDs)))
	args := append([]any{parentFolderID}, utils.AnyArray(folderIDs)...)
	_, err := a.conn.Exec(q, args...)
	return err
}

func (a *Database) getAncestors(folderID int) (map[int]int, error) {
	q := `WITH RECURSIVE folder_tree AS (
			SELECT parent_folder_id, id
			FROM folders
			WHERE id = ?
			UNION
			SELECT folders.parent_folder_id, folders.id
			FROM folders
				JOIN folder_tree
				ON (folders.id = folder_tree.parent_folder_id)
		  )
		  SELECT parent_folder_id, id
		  FROM folder_tree
		  WHERE parent_folder_id IS NOT NULL`
	rows, err := a.conn.Query(q, folderID)
	if err != nil {
		return nil, err
	}
	res := make(map[int]int)
	for rows.Next() {
		var parentID int
		var childID int
		if err := rows.Scan(&parentID, &childID); err != nil {
			return nil, err
		}
		res[parentID] = childID
	}
	return res, nil
}
