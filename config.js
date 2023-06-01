const config = {
  port: process.env.PORT || 3000,
  mongoAddress: process.env.MONGO_ADDRESS || 'mongodb://127.0.0.1:27017/bitfilmsdb',
  nodeEnv: process.env.NODE_ENV,
  secretKey: process.env.SECRET_KEY,
};

module.exports = config;
