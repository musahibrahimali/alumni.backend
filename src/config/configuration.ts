import { config } from "dotenv";
// configure dotenv
config();


export default () => ({
    port: parseInt(process.env.PORT, 10) || 5000,
    database: {
        host: process.env.DB_URL,
    },
    passport:{
        google:{},
        facebook:{},
    },
    
});