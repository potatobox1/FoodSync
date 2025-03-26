import mongoose from 'mongoose';
const {mongoose} = require('mongoose');

let uri = "mongodb+srv://foodsync:foodsyncpakistan123@foodsync.j0pshvy.mongodb.net/FoodsyncDB?retryWrites=true&w=majority&appName=foodsync";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB Atlas Connected!');
  process.exit(0);
})
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});