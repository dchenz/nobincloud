//go:build integration
// +build integration

package database_test

import (
	"encoding/json"
	"fmt"
	"testing"

	"github.com/dchenz/nobincloud/pkg/model"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

func TestListingFilesAndFolders(t *testing.T) {
	db := createMockDB()
	defer destroyMockDB()

	// Register account.
	err := db.CreateUserAccount(model.NewUserRequest{
		Email:                "example@example.com",
		Nickname:             "test",
		PasswordHash:         "abcdefabcdef",
		AccountEncryptionKey: "aaaaaaaaaaaa",
	})
	assert.NoError(t, err)

	userID, err := db.ResolveAccountID("example@example.com")
	assert.NoError(t, err)

	// ---

	imageFile := model.File{
		ID:   uuid.New(),
		Name: model.Hexadecimal{Bytes: []byte("image.png")},
		ParentFolder: model.JSON[uuid.UUID]{
			Valid: false,
		},
	}
	videosFolder := model.Folder{
		ID:   uuid.New(),
		Name: "videos",
		ParentFolder: model.JSON[uuid.UUID]{
			Valid: false,
		},
	}
	helloFile := model.File{
		ID:   uuid.New(),
		Name: model.Hexadecimal{Bytes: []byte("hello.mp4")},
		ParentFolder: model.JSON[uuid.UUID]{
			Valid: true,
			Value: videosFolder.ID,
		},
	}
	worldFile := model.File{
		ID:   uuid.New(),
		Name: model.Hexadecimal{Bytes: []byte("world.mp4")},
		ParentFolder: model.JSON[uuid.UUID]{
			Valid: true,
			Value: videosFolder.ID,
		},
	}
	myFolder := model.Folder{
		ID:   uuid.New(),
		Name: "my_files",
		ParentFolder: model.JSON[uuid.UUID]{
			Valid: false,
		},
	}

	// Create file: /image.png
	err = db.CreateFile(userID, imageFile)
	assert.NoError(t, err)

	// Create folder: /videos
	err = db.CreateFolder(userID, videosFolder)
	assert.NoError(t, err)

	// Create file: /videos/hello.mp4
	err = db.CreateFile(userID, helloFile)
	assert.NoError(t, err)

	// Create file: /videos/world.mp4
	err = db.CreateFile(userID, worldFile)
	assert.NoError(t, err)

	// Create folder: /my_files
	err = db.CreateFolder(userID, myFolder)
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
	assert.EqualError(t, err, fmt.Sprintf("folder '%s' not found", unknownFolderID))
	_, err = db.GetFoldersInFolder(userID, unknownFolderID)
	assert.EqualError(t, err, fmt.Sprintf("folder '%s' not found", unknownFolderID))
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
				ID:   uuid.MustParse("ff0d78a8-deca-4e6c-be70-e3eaec197578"),
				Name: model.Hexadecimal{Bytes: []byte("image.png")},
				ParentFolder: model.JSON[uuid.UUID]{
					Valid: false,
				},
			},
			json: `
			{
				"id": "ff0d78a8-deca-4e6c-be70-e3eaec197578",
				"name": "696d6167652e706e67",
				"parent_folder": null
			}`,
		},
		{
			isFile: false,
			obj: model.Folder{
				ID:   uuid.MustParse("acf4a06f-80e5-4418-991d-fb5d8ed1d3ba"),
				Name: "videos",
				ParentFolder: model.JSON[uuid.UUID]{
					Valid: false,
				},
			},
			json: `
			{
				"id": "acf4a06f-80e5-4418-991d-fb5d8ed1d3ba",
				"name": "videos",
				"parent_folder": null,
				"color": null
			}`,
		},
		{
			isFile: true,
			obj: model.File{
				ID:   uuid.MustParse("8a79610b-7eb0-4038-9846-12e2d5891ddc"),
				Name: model.Hexadecimal{Bytes: []byte("hello.mp4")},
				ParentFolder: model.JSON[uuid.UUID]{
					Valid: true,
					Value: uuid.MustParse("acf4a06f-80e5-4418-991d-fb5d8ed1d3ba"),
				},
			},
			json: `
			{
				"id": "8a79610b-7eb0-4038-9846-12e2d5891ddc",
				"name": "68656c6c6f2e6d7034",
				"parent_folder": "acf4a06f-80e5-4418-991d-fb5d8ed1d3ba"
			}`,
		},
		{
			isFile: false,
			obj: model.Folder{
				ID:   uuid.MustParse("151f87f0-e77b-4381-810e-6a18ba953b93"),
				Name: "my_files",
				ParentFolder: model.JSON[uuid.UUID]{
					Valid: true,
					Value: uuid.MustParse("acf4a06f-80e5-4418-991d-fb5d8ed1d3ba"),
				},
				Color: model.JSON[model.Color]{
					Valid: true,
					Value: 16750848,
				},
			},
			json: `
			{
				"id": "151f87f0-e77b-4381-810e-6a18ba953b93",
				"name": "my_files",
				"parent_folder": "acf4a06f-80e5-4418-991d-fb5d8ed1d3ba",
				"color": "ff9900"
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
