const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGODB_URI,
    fileSize: 10 * 1024 * 1024, // 10MB
    allowedFileTypes: [
      'application/zip',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ]
  };
  