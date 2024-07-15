export default () => ({
    jwtSecret: process.env.JWT_SECRET || 'secretKey',
    mongoURI: process.env.MONGO_URI || 'mongodb+srv://Heythem:JmSTyMNuLUOgxCaB@cluster0.akuarag.mongodb.net/Orange',
  });
  