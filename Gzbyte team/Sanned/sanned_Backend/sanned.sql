
CREATE TABLE Users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255),
    role ENUM('sponsor', 'seeker', 'doer') NOT NULL,
    location VARCHAR(255),
    is_in_gaza BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE Profiles (
--     id BIGINT PRIMARY KEY AUTO_INCREMENT,
--     user_id BIGINT NOT NULL,
--     bio TEXT,
--     FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
-- );


CREATE TABLE UserSkills (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    skill VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);


CREATE TABLE Requests (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    type ENUM('donation', 'exchange', 'service') NOT NULL,
    title VARCHAR(150),
    description TEXT,
    location VARCHAR(255),
        status ENUM('approved', 'rejected', 'matched', 'done') DEFAULT 'approved',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);


CREATE TABLE Matches (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    request_id BIGINT NOT NULL,
    matched_with_id BIGINT NOT NULL,
    status ENUM('initiated', 'confirmed', 'cancelled') DEFAULT 'initiated',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES Requests(id) ON DELETE CASCADE,
    FOREIGN KEY (matched_with_id) REFERENCES Users(id) ON DELETE CASCADE
);


CREATE TABLE Transactions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    sponsor_id BIGINT NOT NULL,
    seeker_id BIGINT,
    request_id BIGINT,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    checkout_ref VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sponsor_id) REFERENCES Users(id),
    FOREIGN KEY (seeker_id) REFERENCES Users(id),
    FOREIGN KEY (request_id) REFERENCES Requests(id)
);
CREATE TABLE Reports (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    request_id BIGINT NOT NULL,
    reported_by BIGINT NOT NULL,  
    reason TEXT,                  
    status ENUM('pending', 'reviewed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES Requests(id) ON DELETE CASCADE,
    FOREIGN KEY (reported_by) REFERENCES Users(id) ON DELETE CASCADE
);


-- CREATE TABLE Moderation (
--     id BIGINT PRIMARY KEY AUTO_INCREMENT,
--     request_id BIGINT NOT NULL,
--     reviewed_by BIGINT NOT NULL,
--     status ENUM('approved', 'rejected'),
--     notes TEXT,
--     reviewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (request_id) REFERENCES Requests(id),
--     FOREIGN KEY (reviewed_by) REFERENCES Users(id)
-- );
