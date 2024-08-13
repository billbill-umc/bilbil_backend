
INSERT INTO user (email, userId, username, phoneNumber, password, salt)
    VALUES ('example@mail.com', 'exampleUser1', 'user1', '010-0000-0000', '29465fd5f8364e1956c6e5193d7aa741e4bab77c0db084e4b5c2fc607da4d57e', 'qweasdzxc');

INSERT INTO user (email, userId, username, phoneNumber, password, salt)
VALUES ('test@mail.com', 'testUser1', 'uusseerr', '010-1234-5678', '29465fd5f8364e1956c6e5193d7aa741e4bab77c0db084e4b5c2fc607da4d57e', 'qweasdzxc');


INSERT INTO category (name)
    VALUES ('의류'), ('가구'), ('가전제품'), ('생활용품'), ('도서/음반'), ('게임/취미'), ('반려동물용품'), ('기타');

INSERT INTO post (authorId, categoryId, areaCode, itemName, price, deposit, description, dateBegin, dateEnd, itemCondition)
    VALUES (1, 1, 1111010100, '물품명', 10000, 1000, '물품 설명', '2024-08-01 12:00:00', '2024-09-01 12:00:00', 'NEW');

INSERT INTO post (authorId, categoryId, areaCode, itemName, price, deposit, description, dateBegin, dateEnd, itemCondition)
VALUES (2, 3, 1111010100, '물품명2', 100001, 10001, '물품 설명2', '2024-08-01 12:00:00', '2024-09-01 12:00:00', 'NEW');

INSERT INTO chat (postId, senderId, receiverId)
    VALUES (1, 2, 1);

INSERT INTO chat (postId, senderId, receiverId)
    VALUES (2, 1, 2);

INSERT INTO chatMessage (chatId, senderId, type, content)
    VALUES (1, 1, 'TEXT', 'HELLO!'), (1, 2, 'TEXT', 'HI!');

INSERT INTO chatMessage (chatId, senderId, type, content)
    VALUES (2, 2, 'TEXT', 'HELLO!2'), (2, 1, 'TEXT', 'HI!2');

INSERT INTO notification (userId, targetType, targetId)
    VALUES (1, 'MY_POST_INTERESTED', 1),
           (2, 'NEW_CHAT', 1);


INSERT INTO postImage (postId, url)
VALUES (1, 'https://via.placeholder.com/150'),
       (1, 'https://via.placeholder.com/150'),
       (2, 'https://via.placeholder.com/150'),
       (2, 'https://via.placeholder.com/150');
