INSERT INTO user (email, username, phoneNumber, password, salt)
VALUES ('example@mail.com', 'user1', '010-0000-0000',
        '29465fd5f8364e1956c6e5193d7aa741e4bab77c0db084e4b5c2fc607da4d57e', 'qweasdzxc');

INSERT INTO user (email, username, phoneNumber, password, salt)
VALUES ('test@mail.com', 'uusseerr', '010-1234-5678',
        '29465fd5f8364e1956c6e5193d7aa741e4bab77c0db084e4b5c2fc607da4d57e', 'qweasdzxc');

SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';

INSERT INTO category (id, name)
VALUES (0, '전체'),
       (1, '캠핑'),
       (2, '공구'),
       (3, '스포츠'),
       (4, '기타');

INSERT INTO category (id, name)
VALUES (1000, '물물교환 - 전체'),
       (1001, '물물교환 - 캠핑'),
       (1002, '물물교환 - 스포츠'),
       (1004, '물물교환 - 기타');

SET SQL_MODE = 'NO_ENGINE_SUBSTITUTION';

INSERT INTO post (authorId, categoryId, areaCode, itemName, price, deposit, description, dateBegin, dateEnd,
                  itemCondition)
VALUES (1, 1, 1111010100, '물품명', 10000, 1000, '물품 설명', '2024-08-01 12:00:00', '2024-09-01 12:00:00', 'NEW');

INSERT INTO post (authorId, categoryId, areaCode, itemName, price, deposit, description, dateBegin, dateEnd,
                  itemCondition)
VALUES (1, 3, 1111010100, '물품명2', 100001, 10001, '물품 설명2', '2024-08-01 12:00:00', '2024-09-01 12:00:00', 'NEW');

INSERT INTO post (authorId, categoryId, areaCode, itemName, price, deposit, description, dateBegin, dateEnd,
                  itemCondition)
VALUES (1, 1001, 1111010100, '물품명3', 100002, 10002, '물품 설명3', '2024-08-01 12:00:00', '2024-09-01 12:00:00', 'NEW');

INSERT INTO post (authorId, categoryId, areaCode, itemName, price, deposit, description, dateBegin, dateEnd,
                  itemCondition)
VALUES (1, 1007, 1111010100, '물품명4', 100004, 10004, '물품 설명4', '2024-08-01 12:00:00', '2024-09-01 12:00:00', 'NEW');

INSERT INTO chat (postId, senderId, receiverId)
VALUES (1, 2, 1);

INSERT INTO chat (postId, senderId, receiverId)
VALUES (2, 1, 2);

INSERT INTO chatMessage (chatId, senderId, type, content)
VALUES (2, 1, 'TEXT', 'HELLO!'),
       (2, 2, 'TEXT', 'HI!');

INSERT INTO chatMessage (chatId, senderId, type, content)
VALUES (3, 2, 'TEXT', 'HELLO!2'),
       (3, 1, 'TEXT', 'HI!2');

INSERT INTO notification (userId, targetType, targetId)
VALUES (1, 'MY_POST_INTERESTED', 1),
       (2, 'NEW_CHAT', 1);

ALTER TABLE notification
    MODIFY COLUMN targetType enum(
        'MY_POST_ADDED_FAVORITE',
        'NEW_MESSAGE',
        'NEW_RENT_REQUEST',
        'CANCEL_RENT_REQUEST',
        'ACCEPT_RENT_REQUEST',
        'REJECT_RENT_REQUEST'
        )
    NOT NULL;


INSERT INTO postImage (postId, url)
VALUES (1, 'https://via.placeholder.com/150'),
       (1, 'https://via.placeholder.com/150'),
       (2, 'https://via.placeholder.com/150'),
       (2, 'https://via.placeholder.com/150');
