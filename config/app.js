const pass = 'mongodb+srv://testmongo:testmongo@cluster0-f98nr.gcp.mongodb.net/angl?retryWrites=true';
module.exports = {
  appPort: process.env.PORT || 3000,
  mongoUri: pass,
  jwt: {
    jwtSecret: 'jwtSecret',
    tokens: {
      access: {
        type: 'access',
        expiresIn: '1440m',
      },
      refresh: {
        type: 'refresh',
        expiresIn: '4320m',
      },
    },
  },
};
