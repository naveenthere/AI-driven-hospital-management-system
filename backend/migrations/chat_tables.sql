
CREATE TABLE IF NOT EXISTS chat_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50),
    user_role VARCHAR(20),
    query_text TEXT,
    detected_intent VARCHAR(100),
    response_text TEXT,
    confidence_score FLOAT,
    is_allowed BOOLEAN,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rbac_intents (
    intent_name VARCHAR(100) PRIMARY KEY,
    allowed_roles JSON,
    description VARCHAR(255)
);
