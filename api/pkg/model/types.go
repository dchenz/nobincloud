package model

import (
	"database/sql/driver"
	"encoding/hex"
	"encoding/json"
	"fmt"
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

type NullBytes struct {
	Valid bool
	Bytes []byte
}

func (s *NullBytes) Scan(value any) error {
	if value == nil {
		s.Valid = false
		return nil
	}
	v, ok := value.([]byte)
	if !ok {
		return fmt.Errorf("invalid value in NullBytes")
	}
	s.Valid = true
	s.Bytes = v
	return nil
}

func (s NullBytes) Value() (driver.Value, error) {
	if !s.Valid {
		return nil, nil
	}
	return s.Bytes, nil
}

type Hexadecimal struct {
	Bytes []byte
}

func (s Hexadecimal) MarshalJSON() ([]byte, error) {
	if s.Bytes == nil {
		return []byte("null"), nil
	}
	return json.Marshal(hex.EncodeToString(s.Bytes))
}

func (s *Hexadecimal) UnmarshalJSON(b []byte) error {
	if string(b) == "null" {
		s.Bytes = nil
		return nil
	}
	var v string
	if err := json.Unmarshal(b, &v); err != nil {
		return err
	}
	decodedBytes, err := hex.DecodeString(v)
	s.Bytes = decodedBytes
	return err
}
