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

func TestMarshalColor(t *testing.T) {
	testCases := []struct {
		input    model.Color
		expected string
		invalid  bool
	}{
		{
			input:    16119285,
			expected: "\"f5f5f5\"",
		},
		{
			input:    255,
			expected: "\"0000ff\"",
		},
		{
			input:    0,
			expected: "\"000000\"",
		},
		{
			input:   -1,
			invalid: true,
		},
		{
			input:   0xFFFFFF + 1,
			invalid: true,
		},
	}
	for _, tc := range testCases {
		b, err := json.Marshal(tc.input)
		if tc.invalid {
			assert.ErrorContains(t, err, "invalid RGB value")
		} else {
			assert.NoError(t, err)
			assert.JSONEq(t, tc.expected, string(b))
		}
	}
}

func TestUnmarshalColor(t *testing.T) {
	testCases := []struct {
		input    string
		expected model.Color
		invalid  bool
	}{
		{
			input:    "\"f5f5f5\"",
			expected: 16119285,
		},
		{
			input:    "\"0000ff\"",
			expected: 255,
		},
		{
			input:    "\"000000\"",
			expected: 0,
		},
		{
			input:   "\"f00\"",
			invalid: true,
		},
		{
			input:   "\"f000\"",
			invalid: true,
		},
		{
			input:   "\"ff00ff00\"",
			invalid: true,
		},
		{
			input:   "\"\"",
			invalid: true,
		},
	}
	for _, tc := range testCases {
		var s model.Color
		err := json.Unmarshal([]byte(tc.input), &s)
		if tc.invalid {
			assert.ErrorContains(t, err, "invalid RGB value")
		} else {
			assert.NoError(t, err)
			assert.Equal(t, tc.expected, s)
		}
	}
}

func TestMarshalHexadecimal(t *testing.T) {
	testCases := []struct {
		input    model.Hexadecimal
		expected string
	}{
		{
			input:    model.Hexadecimal{Bytes: []byte("hello world")},
			expected: "\"68656c6c6f20776f726c64\"",
		},
		{
			input:    model.Hexadecimal{Bytes: []byte("")},
			expected: "\"\"",
		},
		{
			input:    model.Hexadecimal{Bytes: nil},
			expected: "null",
		},
	}
	for _, tc := range testCases {
		b, err := json.Marshal(tc.input)
		assert.NoError(t, err)
		assert.JSONEq(t, tc.expected, string(b))
	}
}

func TestUnmarshalHexadecimal(t *testing.T) {
	testCases := []struct {
		input    string
		expected model.Hexadecimal
		invalid  bool
	}{
		{
			input:    "\"68656c6c6f20776f726c64\"",
			expected: model.Hexadecimal{Bytes: []byte("hello world")},
		},
		{
			input:    "\"\"",
			expected: model.Hexadecimal{Bytes: []byte{}},
		},
		{
			input:    "null",
			expected: model.Hexadecimal{Bytes: nil},
		},
		{
			input:   "\"68656c6c6f20776f726c6\"",
			invalid: true,
		},
	}
	for _, tc := range testCases {
		var s model.Hexadecimal
		err := json.Unmarshal([]byte(tc.input), &s)
		if tc.invalid {
			assert.Error(t, err)
		} else {
			assert.NoError(t, err)
			assert.Equal(t, tc.expected, s)
		}
	}
}
