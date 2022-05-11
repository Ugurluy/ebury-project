const env = process.env.VUE_APP_ENV || "development";

const development = {
  env: env,
  API_SERVICE: "https://api.apilayer.com/exchangerates_data",
};

const config: any = {
  development,
};

export default config[env];
