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

// Color is an RGB value represented using the 3 lower-order bytes
// of a 4-byte integer (_ R G B). Values overflowing into the highest
// byte are treated as undefined and will cause an error.
type Color int

// MarshalJSON converts Color into a 6-digit RGB hexadecimal.
func (s Color) MarshalJSON() ([]byte, error) {
	if s < 0 || s > 0xFFFFFF {
		return nil, fmt.Errorf("invalid RGB value")
	}
	v := []byte{
		byte((s & 0xFF0000) >> 16),
		byte((s & 0xFF00) >> 8),
		byte(s & 0xFF),
	}
	return json.Marshal(hex.EncodeToString(v))
}

// UnmarshalJSON converts a 6-digit RGB hexadecimal into Color.
// It doesn't support the 3-digit RGB shorthand format.
func (s *Color) UnmarshalJSON(b []byte) error {
	var h string
	if err := json.Unmarshal(b, &h); err != nil {
		return err
	}
	v, err := hex.DecodeString(h)
	if err != nil {
		return fmt.Errorf("invalid RGB value")
	}
	if len(v) != 3 {
		return fmt.Errorf("invalid RGB value")
	}
	n := 0
	n |= int(v[0]) << 16
	n |= int(v[1]) << 8
	n |= int(v[2])
	*s = Color(n)
	return nil
}
