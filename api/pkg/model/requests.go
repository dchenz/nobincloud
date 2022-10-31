package model

type Response struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
}

type NewUserRequest struct {
	FirstName            string `json:"first_name" validate:"required"`
	LastName             string `json:"last_name" validate:"required"`
	Email                string `json:"email" validate:"required,email"`
	ClientHashedPassword string `json:"password_hash" validate:"required,sha512"`
}

type LoginRequest struct {
	Email                string `json:"email" validate:"required"`
	ClientHashedPassword string `json:"password_hash" validate:"required,sha512"`
}
