import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './middlewares/globalErrorhandler';
import notFound from './middlewares/notFound';
import router from './routes';

const app: Application = express();

// parsers
app.use(
  express.json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf;
    },
  }),
);
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(cookieParser())

// application routes
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Apollo Gears World!');
});

// global error handler
app.use(globalErrorHandler);
// not found handler 
app.use(notFound)

export default app;
