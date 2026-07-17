export default () => ({
  port: parseInt(process.env.PORT || ''),

  dbHost: process.env.DB_HOST,
  dbPort: parseInt(process.env.DB_PORT || ''),

  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,

  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,

  nodeENV: process.env.NODE_ENV,

  fastApiUrl: process.env.FASTAPI_URL,

  resendApiKey: process.env.RESEND_API_KEY,
});
