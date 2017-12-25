const TransactionApi = require('./utils/apiUtils');
const uuidv4 = require('uuid/v4');


TransactionApi.addItem(uuidv4(), "Test Item #1").then(result => {
  console.log(result);
});