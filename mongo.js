const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>');
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://MattJ:${password}@cluster0.wqfecr1.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

mongoose
  .connect(url)
  .then(() => {
    console.log('connected');

    if (name && number) {
      const person = new Person({
        name,
        number,
      });

      return person.save();
    } else {
      return Person.find({});
    }
  })
  .then(result => {

    if (name && number) {
      console.log(`added ${result.name} number ${number} to phonebook`);
    } else {
      console.log('phonebook:');
      result.forEach(person => {
        console.log(person.name, person.number);
      });
    }

    return mongoose.connection.close();
  })
  .catch(err => {
    console.log(err);
  });
