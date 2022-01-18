const cors = require('cors');
const express = require('express');

const search = require('./search.js');
const history = require('./history.js');
const app = express();
const port = 8888;


app.use(cors());
app.use(express.json());

app.use('/search', search);
app.use('/history', history);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
