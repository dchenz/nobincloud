package model

import (
	"encoding/hex"
	"encoding/json"
)

type JSON[T any] struct {
	Valid bool
	Value T
}

func (s JSON[T]) MarshalJSON() ([]byte, error) {
	if s.Valid {
		return json.Marshal(s.Value)
	}
	return json.Marshal(nil)
}

func (s *JSON[T]) UnmarshalJSON(b []byte) error {
	if string(b) == "null" {
		s.Valid = false
		return nil
	}
	err := json.Unmarshal(b, &s.Value)
	s.Valid = (err == nil)
	return err
}

type Color int

func (s Color) MarshalJSON() ([]byte, error) {
	v := []byte{
		byte((s & 0xFF0000) >> 16),
		byte((s & 0xFF00) >> 8),
		byte(s & 0xFF),
	}
	return json.Marshal(hex.EncodeToString(v))
}

func (s *Color) UnmarshalJSON(b []byte) error {
	if string(b) == "null" {
		*s = 0
		return nil
	}
	var h string
	err := json.Unmarshal(b, &h)
	if err != nil {
		return err
	}
	v, err := hex.DecodeString(h)
	if err != nil {
		return err
	}
	n := 0
	n |= int(v[0]) << 16
	n |= int(v[1]) << 8
	n |= int(v[2])
	*s = Color(n)
	return nil
}
