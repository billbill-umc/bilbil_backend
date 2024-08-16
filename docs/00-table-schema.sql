CREATE TABLE user
(
    id          INT PRIMARY KEY AUTO_INCREMENT,
    email       VARCHAR(255) NOT NULL UNIQUE,
    username    VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(30)  NOT NULL,
    password    VARCHAR(512) NOT NULL,
    salt        VARCHAR(512) NOT NULL,
    isWithdraw  BOOLEAN   DEFAULT false,
    createdAt   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE userAvatar
(
    id        INT PRIMARY KEY AUTO_INCREMENT,
    userId    INT          NOT NULL,
    url       VARCHAR(512) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isDeleted BOOLEAN   DEFAULT false,
    FOREIGN KEY (userId) REFERENCES user (id) ON DELETE CASCADE
);

CREATE TABLE category
(
    id   INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE areaSiDo
(
    id   INT PRIMARY KEY AUTO_INCREMENT,
    code BIGINT       NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE areaSiGunGu
(
    id       INT PRIMARY KEY AUTO_INCREMENT,
    siDoCode BIGINT       NOT NULL,
    code     BIGINT       NOT NULL UNIQUE,
    name     VARCHAR(255) NOT NULL,
    FOREIGN KEY (siDoCode) REFERENCES areaSiDo (code)
);

CREATE TABLE areaEubMyeonDong
(
    id          INT PRIMARY KEY AUTO_INCREMENT,
    siGunGuCode BIGINT       NOT NULL,
    code        BIGINT       NOT NULL UNIQUE,
    name        VARCHAR(255) NOT NULL,
    FOREIGN KEY (siGunGuCode) REFERENCES areaSiGunGu (code)
);

CREATE TABLE post
(
    id            INT PRIMARY KEY AUTO_INCREMENT,
    authorId      INT          NOT NULL,
    categoryId    INT          NOT NULL,
    areaCode      BIGINT       NOT NULL,
    itemName      VARCHAR(255) NOT NULL,
    price         INT          NOT NULL,
    deposit       INT          NOT NULL,
    description   TEXT         NOT NULL,
    dateBegin     DATETIME,
    dateEnd       DATETIME,
    itemCondition ENUM ('NEW', 'HIGH', 'MIDDLE', 'LOW'),
    isDeleted     BOOLEAN   DEFAULT false,
    createdAt     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (authorId) REFERENCES user (id) ON DELETE CASCADE,
    FOREIGN KEY (categoryId) REFERENCES category (id),
    FOREIGN KEY (areaCode) REFERENCES areaEubMyeonDong (code)
);

CREATE TABLE postImage
(
    id        INT PRIMARY KEY AUTO_INCREMENT,
    postId    INT          NOT NULL,
    url       VARCHAR(512) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isDeleted BOOLEAN   DEFAULT false,
    FOREIGN KEY (postId) REFERENCES post (id) ON DELETE CASCADE
);

CREATE TABLE rentRequest
(
    id         INT PRIMARY KEY AUTO_INCREMENT,
    postId     INT NOT NULL,
    borrowerId INT NOT NULL,
    dateBegin  DATETIME,
    dateEnd    DATETIME,
    isCanceled BOOLEAN   DEFAULT false,
    createdAt  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (postId) REFERENCES post (id) ON DELETE CASCADE,
    FOREIGN KEY (borrowerId) REFERENCES user (id)
);

CREATE TABLE rent
(
    id         INT PRIMARY KEY AUTO_INCREMENT,
    postId     INT NOT NULL,
    requestId  INT NOT NULL,
    isCanceled BOOLEAN   DEFAULT false,
    createdAt  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (postId) REFERENCES post (id) ON DELETE CASCADE,
    FOREIGN KEY (requestId) REFERENCES rentRequest (id) ON DELETE CASCADE
);

CREATE TABLE interestPost
(
    id        INT PRIMARY KEY AUTO_INCREMENT,
    postId    INT NOT NULL,
    userId    INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (postId) REFERENCES post (id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES user (id) ON DELETE CASCADE
);

CREATE TABLE chat
(
    id         INT PRIMARY KEY AUTO_INCREMENT,
    postId     INT NOT NULL,
    senderId   INT NOT NULL,
    receiverId INT NOT NULL,
    createdAt  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (postId) REFERENCES post (id) ON DELETE CASCADE,
    FOREIGN KEY (senderId) REFERENCES user (id) ON DELETE CASCADE,
    FOREIGN KEY (receiverId) REFERENCES user (id) ON DELETE CASCADE
);

CREATE TABLE chatMessage
(
    id        INT PRIMARY KEY AUTO_INCREMENT,
    chatId    INT  NOT NULL,
    senderId  INT  NOT NULL,
    type      ENUM ('TEXT', 'IMAGE') NOT NULL DEFAULT 'TEXT',
    content   TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chatId) REFERENCES chat (id) ON DELETE CASCADE,
    FOREIGN KEY (senderId) REFERENCES user (id) ON DELETE CASCADE
);

CREATE TABLE chatImage
(
    id        INT PRIMARY KEY AUTO_INCREMENT,
    chatId    INT          NOT NULL,
    url       VARCHAR(512) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isDeleted BOOLEAN   DEFAULT false,
    FOREIGN KEY (chatId) REFERENCES chat (id) ON DELETE CASCADE
);

CREATE TABLE notification
(
    id         INT PRIMARY KEY AUTO_INCREMENT,
    userId     INT NOT NULL,
    targetType ENUM ('MY_POST_INTERESTED', 'NEW_CHAT', 'LENT', 'BORROW', 'CANCEL_LENT', 'CANCEL_BORROW') NOT NULL,
    targetId   INT,
    isRead     BOOLEAN   DEFAULT false,
    createdAt  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES user (id) ON DELETE CASCADE
);
