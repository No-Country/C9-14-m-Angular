const chance = require('chance').Chance();
const fs = require('fs');
const crypto = require('crypto');



const createUsers =  () => {
  let users = [];

  for (let i = 0; i < 50; i++) {
    let user = {};
    user.code = crypto.randomBytes(16).toString('hex')
    user.name = chance.name()
    user.last_name = chance.last()
    // user.created_at = chance.date({year:2022})
    // user.updated_at = chance.date({year:2022, min: user.created_at})
    user.created_at = chance.date({year:2021})
    user.updated_at = chance.date({year:2022})
    user.password = chance.string({length: 12})
    user.email = chance.email({domain: "gmail.com"})
    
    users.push(user);
  }

  return users;
}

let data =  createUsers();

let jsonString = JSON.stringify(data, null, 2);

fs.writeFile('users.json', jsonString, (err) => {
    if (err) {
        console.error(err);
        return;
    };
    console.log("File has been created");
});

