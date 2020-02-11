const { env } = process;

const config = {
  DATA_STORE: env.DATA_STORE,
  USER_CREDENTIALS: env.USER_CREDENTIALS
};

module.exports = config;
