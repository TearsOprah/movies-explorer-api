const EMAIL_REG = /.+@.+\..+/;
const URL_REG = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
const PASSWORD_REG = /^(?=.*[A-z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/;

module.exports = {
  EMAIL_REG,
  URL_REG,
  PASSWORD_REG,
};
