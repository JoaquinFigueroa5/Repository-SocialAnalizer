'use strict'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import limiter from '../middlewares/validate-can-request.js'
import osintRoutes from '../src/osint/osint.routes.js'

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }))
    app.use(express.json());
    app.use(cors());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const routes = (app) => {
    app.use('/Security/v1/osint', osintRoutes)
}

export const initServer = async() => {
    const app = express();
    const port = process.env.PORT || 3001;
    try {
        middlewares(app);
        routes(app);
        app.listen(port);
        console.log(`server running on port ${port}`)
    } catch (error) {
        console.log(`server init failed: ${error}`);
    }
}