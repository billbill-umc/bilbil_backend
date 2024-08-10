// src/error.js

// 500 Internal Server Error
function handleInternalServerError(res, error) {
    console.error(error); // 에러 로그 출력
    res.status(500).json({ error: 'Internal Server Error' });
}

// 401 Unauthorized Error
function handleUnauthorizedError(res, message = 'Unauthorized: Please log in') {
    res.status(401).json({ message });
}

// 400 Bad Request Error
function handleBadRequestError(res, message = 'Bad Request: Missing required fields') {
    res.status(400).json({ message });
}

// 409 Conflict Error
function handleConflictError(res, message = 'Conflict: Resource already exists') {
    res.status(409).json({ message });
}

module.exports = {
    handleInternalServerError,
    handleUnauthorizedError,
    handleBadRequestError,
    handleConflictError
};
