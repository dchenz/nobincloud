package model_test

import (
	"encoding/json"
	"testing"

	"github.com/dchenz/nobincloud/pkg/model"
	"github.com/stretchr/testify/assert"
)

func TestJSONString(t *testing.T) {
	testCases := []struct {
		input    model.JSON[string]
		expected string
	}{
		{
			input:    model.JSON[string]{Valid: true, Value: "hello world"},
			expected: "\"hello world\"",
		},
		{
			input:    model.JSON[string]{Valid: true, Value: ""},
			expected: "\"\"",
		},
		{
			input:    model.JSON[string]{Valid: false},
			expected: "null",
		},
	}
	for _, tc := range testCases {
		b, err := json.Marshal(tc.input)
		assert.NoError(t, err)
		assert.JSONEq(t, tc.expected, string(b))

		var s model.JSON[string]
		err = json.Unmarshal([]byte(tc.expected), &s)
		assert.NoError(t, err)
		assert.Equal(t, tc.input, s)
	}
}

func TestJSONInt(t *testing.T) {
	testCases := []struct {
		input    model.JSON[int]
		expected string
	}{
		{
			input:    model.JSON[int]{Valid: true, Value: 123},
			expected: "123",
		},
		{
			input:    model.JSON[int]{Valid: true, Value: 0},
			expected: "0",
		},
		{
			input:    model.JSON[int]{Valid: false},
			expected: "null",
		},
	}
	for _, tc := range testCases {
		b, err := json.Marshal(tc.input)
		assert.NoError(t, err)
		assert.JSONEq(t, tc.expected, string(b))

		var s model.JSON[int]
		err = json.Unmarshal([]byte(tc.expected), &s)
		assert.NoError(t, err)
		assert.Equal(t, tc.input, s)
	}
}

func TestJSONBool(t *testing.T) {
	testCases := []struct {
		input    model.JSON[bool]
		expected string
	}{
		{
			input:    model.JSON[bool]{Valid: true, Value: true},
			expected: "true",
		},
		{
			input:    model.JSON[bool]{Valid: true, Value: false},
			expected: "false",
		},
		{
			input:    model.JSON[bool]{Valid: false},
			expected: "null",
		},
	}
	for _, tc := range testCases {
		b, err := json.Marshal(tc.input)
		assert.NoError(t, err)
		assert.JSONEq(t, tc.expected, string(b))

		var s model.JSON[bool]
		err = json.Unmarshal([]byte(tc.expected), &s)
		assert.NoError(t, err)
		assert.Equal(t, tc.input, s)
	}
}

func TestMarshalBytes(t *testing.T) {
	testCases := []struct {
		input    model.Bytes
		expected string
	}{
		{
			input:    model.Bytes{Bytes: []byte("hello world")},
			expected: "\"aGVsbG8gd29ybGQ=\"",
		},
		{
			input:    model.Bytes{Bytes: []byte("")},
			expected: "\"\"",
		},
		{
			input:    model.Bytes{Bytes: nil},
			expected: "null",
		},
	}
	for _, tc := range testCases {
		b, err := json.Marshal(tc.input)
		assert.NoError(t, err)
		assert.JSONEq(t, tc.expected, string(b))
	}
}

func TestUnmarshalBytes(t *testing.T) {
	testCases := []struct {
		input    string
		expected model.Bytes
		invalid  bool
	}{
		{
			input:    "\"aGVsbG8gd29ybGQ=\"",
			expected: model.Bytes{Bytes: []byte("hello world")},
		},
		{
			input:    "\"\"",
			expected: model.Bytes{Bytes: []byte{}},
		},
		{
			input:    "null",
			expected: model.Bytes{Bytes: nil},
		},
		{
			input:   "\"aGVsbG8gd29ybG-\"",
			invalid: true,
		},
	}
	for _, tc := range testCases {
		var s model.Bytes
		err := json.Unmarshal([]byte(tc.input), &s)
		if tc.invalid {
			assert.Error(t, err)
		} else {
			assert.NoError(t, err)
			assert.Equal(t, tc.expected, s)
		}
	}
}
