//go:build integration
// +build integration

package database_test

import (
	"database/sql"
	"encoding/json"
	"testing"

	"github.com/dchenz/nobincloud/pkg/model"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

var fakeEncryptionKey = []byte("123456789012345678901234567890123456789012345678901234567890")

func TestListingFilesAndFolders(t *testing.T) {
	db := createMockDB()
	defer destroyMockDB()

	// Register account.
	err := db.CreateUserAccount(model.NewUserRequest{
		Email:                "example@example.com",
		PasswordHash:         "abcdefabcdef",
		AccountEncryptionKey: "aaaaaaaaaaaa",
	})
	assert.NoError(t, err)

	userID, err := db.ResolveAccountID("example@example.com")
	assert.NoError(t, err)

	// ---

	imageFile := model.File{
		ID: uuid.New(),
		ParentFolder: model.JSON[uuid.UUID]{
			Valid: false,
		},
		EncryptionKey: model.Bytes{Bytes: fakeEncryptionKey},
		Metadata:      model.Bytes{Bytes: []byte("test")},
	}
	videosFolder := model.Folder{
		ID: uuid.New(),
		ParentFolder: model.JSON[uuid.UUID]{
			Valid: false,
		},
		EncryptionKey: model.Bytes{Bytes: fakeEncryptionKey},
		Metadata:      model.Bytes{Bytes: []byte("test")},
	}
	helloFile := model.File{
		ID: uuid.New(),
		ParentFolder: model.JSON[uuid.UUID]{
			Valid: true,
			Value: videosFolder.ID,
		},
		EncryptionKey: model.Bytes{Bytes: fakeEncryptionKey},
		Metadata:      model.Bytes{Bytes: []byte("test")},
	}
	worldFile := model.File{
		ID: uuid.New(),
		ParentFolder: model.JSON[uuid.UUID]{
			Valid: true,
			Value: videosFolder.ID,
		},
		EncryptionKey: model.Bytes{Bytes: fakeEncryptionKey},
		Metadata:      model.Bytes{Bytes: []byte("test")},
	}
	myFolder := model.Folder{
		ID: uuid.New(),
		ParentFolder: model.JSON[uuid.UUID]{
			Valid: false,
		},
		EncryptionKey: model.Bytes{Bytes: fakeEncryptionKey},
		Metadata:      model.Bytes{Bytes: []byte("test")},
	}

	// Create file: /image.png
	err = db.CreateFile(userID, imageFile)
	assert.NoError(t, err)

	// Create folder: /videos
	err = db.UpsertFolder(userID, videosFolder)
	assert.NoError(t, err)

	// Create file: /videos/hello.mp4
	err = db.CreateFile(userID, helloFile)
	assert.NoError(t, err)

	// Create file: /videos/world.mp4
	err = db.CreateFile(userID, worldFile)
	assert.NoError(t, err)

	// Create folder: /my_files
	err = db.UpsertFolder(userID, myFolder)
	assert.NoError(t, err)

	// List files in /videos
	files, err := db.GetFilesInFolder(userID, videosFolder.ID)
	assert.NoError(t, err)
	assert.Contains(t, files, helloFile)
	assert.Contains(t, files, worldFile)
	assert.Len(t, files, 2)

	// List folders in /videos
	folders, err := db.GetFoldersInFolder(userID, videosFolder.ID)
	assert.NoError(t, err)
	assert.Len(t, folders, 0)

	// List files in root (zero uuid)
	files, err = db.GetFilesInFolder(userID, uuid.Nil)
	assert.NoError(t, err)
	assert.Contains(t, files, imageFile)
	assert.Len(t, files, 1)

	// List folders in root (zero uuid)
	folders, err = db.GetFoldersInFolder(userID, uuid.Nil)
	assert.NoError(t, err)
	assert.Contains(t, folders, videosFolder)
	assert.Contains(t, folders, myFolder)
	assert.Len(t, folders, 2)

	// List folders of another user and it should return empty
	folders, err = db.GetFoldersInFolder(1234, uuid.Nil)
	assert.NoError(t, err) // Unknown user is not checked here.
	assert.Len(t, folders, 0)

	// List unknown folder and get an error
	unknownFolderID := uuid.New()
	_, err = db.GetFilesInFolder(userID, unknownFolderID)
	assert.ErrorIs(t, err, sql.ErrNoRows)
	_, err = db.GetFoldersInFolder(userID, unknownFolderID)
	assert.ErrorIs(t, err, sql.ErrNoRows)
}

func TestJSONFilesAndFolders(t *testing.T) {
	testCases := []struct {
		isFile bool
		obj    interface{}
		json   string
	}{
		{
			isFile: true,
			obj: model.File{
				ID: uuid.MustParse("ff0d78a8-deca-4e6c-be70-e3eaec197578"),
				ParentFolder: model.JSON[uuid.UUID]{
					Valid: false,
				},
				EncryptionKey: model.Bytes{Bytes: []byte("test")},
				Metadata:      model.Bytes{Bytes: []byte("hello world")},
			},
			json: `
			{
				"id": "ff0d78a8-deca-4e6c-be70-e3eaec197578",
				"parentFolder": null,
				"encryptionKey": "dGVzdA==",
				"metadata": "aGVsbG8gd29ybGQ="
			}`,
		},
		{
			isFile: false,
			obj: model.Folder{
				ID: uuid.MustParse("acf4a06f-80e5-4418-991d-fb5d8ed1d3ba"),
				ParentFolder: model.JSON[uuid.UUID]{
					Valid: false,
				},
				EncryptionKey: model.Bytes{Bytes: []byte("test")},
				Metadata:      model.Bytes{Bytes: []byte("hello world")},
			},
			json: `
			{
				"id": "acf4a06f-80e5-4418-991d-fb5d8ed1d3ba",
				"parentFolder": null,
				"encryptionKey": "dGVzdA==",
				"metadata": "aGVsbG8gd29ybGQ="
			}`,
		},
		{
			isFile: true,
			obj: model.File{
				ID: uuid.MustParse("8a79610b-7eb0-4038-9846-12e2d5891ddc"),
				ParentFolder: model.JSON[uuid.UUID]{
					Valid: true,
					Value: uuid.MustParse("acf4a06f-80e5-4418-991d-fb5d8ed1d3ba"),
				},
				EncryptionKey: model.Bytes{Bytes: []byte("test")},
				Metadata:      model.Bytes{Bytes: []byte("hello world")},
			},
			json: `
			{
				"id": "8a79610b-7eb0-4038-9846-12e2d5891ddc",
				"parentFolder": "acf4a06f-80e5-4418-991d-fb5d8ed1d3ba",
				"encryptionKey": "dGVzdA==",
				"metadata": "aGVsbG8gd29ybGQ="
			}`,
		},
		{
			isFile: false,
			obj: model.Folder{
				ID: uuid.MustParse("151f87f0-e77b-4381-810e-6a18ba953b93"),
				ParentFolder: model.JSON[uuid.UUID]{
					Valid: true,
					Value: uuid.MustParse("acf4a06f-80e5-4418-991d-fb5d8ed1d3ba"),
				},
				EncryptionKey: model.Bytes{Bytes: []byte("test")},
				Metadata:      model.Bytes{Bytes: []byte("hello world")},
			},
			json: `
			{
				"id": "151f87f0-e77b-4381-810e-6a18ba953b93",
				"parentFolder": "acf4a06f-80e5-4418-991d-fb5d8ed1d3ba",
				"encryptionKey": "dGVzdA==",
				"metadata": "aGVsbG8gd29ybGQ="
			}`,
		},
	}

	for _, tc := range testCases {
		b, err := json.Marshal(tc.obj)
		assert.NoError(t, err)
		assert.JSONEq(t, tc.json, string(b))
		if tc.isFile {
			var v model.File
			err = json.Unmarshal(b, &v)
			assert.NoError(t, err)
			assert.Equal(t, tc.obj, v)
		} else {
			var v model.Folder
			err = json.Unmarshal(b, &v)
			assert.NoError(t, err)
			assert.Equal(t, tc.obj, v)
		}
	}
}

func TestFolderUpsert(t *testing.T) {
	db := createMockDB()
	defer destroyMockDB()

	// Register account.
	err := db.CreateUserAccount(model.NewUserRequest{
		Email:                "example@example.com",
		PasswordHash:         "abcdefabcdef",
		AccountEncryptionKey: "aaaaaaaaaaaa",
	})
	assert.NoError(t, err)

	userID, err := db.ResolveAccountID("example@example.com")
	assert.NoError(t, err)

	// ---

	f := model.Folder{
		ID: uuid.New(),
		ParentFolder: model.JSON[uuid.UUID]{
			Valid: false,
		},
		EncryptionKey: model.Bytes{Bytes: fakeEncryptionKey},
		Metadata:      model.Bytes{Bytes: []byte("test")},
	}

	err = db.UpsertFolder(userID, f)
	assert.NoError(t, err)
	ff, err := db.GetFolder(userID, f.ID)
	assert.NoError(t, err)
	assert.Equal(t, f, *ff)

	f.Metadata.Bytes = []byte("test 123")
	err = db.UpsertFolder(userID, f)
	assert.NoError(t, err)
	ff, err = db.GetFolder(userID, f.ID)
	assert.NoError(t, err)
	assert.Equal(t, f, *ff)
}
