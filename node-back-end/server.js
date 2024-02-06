import express from 'express'
import routes from './api.js'
import cors from 'cors'
const app = express();
const port = process.env.PORT || 3000;;

app.use(cors());
app.use(express.json()); // for parsing application/jsonaa
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use('/api',routes);

app.listen(port, () => {
  console.log(process.env.NAME);
  console.log(`Server running at http://localhost:${port}/`);
});