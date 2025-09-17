-- Migration: Add password fields for authentication
-- Run this after initial_sql.sql

-- Add password field to users table
ALTER TABLE users 
ADD COLUMN password_hash VARCHAR(255),
ADD COLUMN created_at TIMESTAMP DEFAULT NOW();

-- Add password field to contributor_data table 
-- (contributors will have separate login from their base user account)
ALTER TABLE contributor_data 
ADD COLUMN password_hash VARCHAR(255),
ADD COLUMN created_at TIMESTAMP DEFAULT NOW();

-- Create table for JWT refresh tokens
CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    contributor_id INT REFERENCES contributor_data(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    -- Ensure only one of user_id or contributor_id is set
    CONSTRAINT check_user_or_contributor CHECK (
        (user_id IS NOT NULL AND contributor_id IS NULL) OR 
        (user_id IS NULL AND contributor_id IS NOT NULL)
    )
);

-- Create index for efficient token lookups
CREATE INDEX idx_refresh_tokens_active ON refresh_tokens(token_hash, is_active, expires_at);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_contributor ON refresh_tokens(contributor_id);