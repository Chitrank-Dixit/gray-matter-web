const config = {
    mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/graymatter',
    port: process.env.PORT || 8000,
    secret: 'your_jwt_secret'
  };
  
module.exports = config;