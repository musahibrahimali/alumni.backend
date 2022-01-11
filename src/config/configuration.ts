import { config } from "dotenv";
// configure dotenv
config();


export default () => ({
    port: parseInt(process.env.PORT, 10) || 5000,
    domain: process.env.DOMAIN,
    database: {
        host: process.env.DB_URL,
    },
    passport:{
        google:{},
        facebook:{},
    },
    
});