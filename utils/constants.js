const ERROR_CODE_BAD_REQUEST = 400;
const ERROR_CODE_NOT_FOUND = 404;
const ERROR_CODE_INTERNAL_SERVER_ERROR = 500;
const STATUS_OK = 200;
const STATUS_CREATED = 201;
const ERROR_CODE_UNAUTHORIZED = 401;
const ERROR_CODE_FORBIDDEN = 403;

const successMessages = {
  movieCreated: 'Фильм успешно сохранен в личном кабинете',
  movieDeleted: 'Фильм успешно удален из личного кабинета пользователя',
  userRegistered: 'Пользователь успешно зарегистрирован на сайте',
};

const errorMessages = {
  inaccurateData: 'Переданы некорректные данные',
  movieNotFound: 'Данные фильма не найдены',
  accessDenied: 'Нет прав доступа',
  userNotFound: 'Пользователь не найден',
  invalidId: 'Некорректный id пользователя',
  updateFailed: 'Переданы некорректные данные при обновлении данных профиля пользователя',
  duplicateEmail: 'Пользователь с таким электронным адресом уже зарегистрирован',
  invalidCredentials: 'Неправильные почта или пароль',
};

module.exports = {
  ERROR_CODE_BAD_REQUEST,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_INTERNAL_SERVER_ERROR,
  STATUS_OK,
  STATUS_CREATED,
  ERROR_CODE_UNAUTHORIZED,
  ERROR_CODE_FORBIDDEN,

  successMessages,
  errorMessages,
};
