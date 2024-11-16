import app from './src/app.js';
import logger from './src/utils/logger.js';

const port = process.env.PROT || 4001;

app.listen(port,()=>{
    logger.info(`server is running on port ${port}`);
});


