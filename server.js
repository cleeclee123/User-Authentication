const express = require("express");
const app = express();
const bcrypt = require("bcrypt");

app.use(express.json());

const users = [];

app.get('/users', (request, response) => {
    response.json(users);
});

app.post('/users', async (request, response) => {
    try {
        // const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(request.body.password, 10);
        
        //console.log(salt);
        //console.log(hashedPassword);

        const user = { name: request.body.name, password: hashedPassword };
        users.push(user);
        response.status(201).send();
    } catch {
        response.status(500).send();
    }
});

app.post('/users/login', async (request, response) => {
    const user = users.find(user => user.name === request.body.name);

    if (user == null) {
        return response.status(400).send("user not found in system"); // never created
    }
    try {
        if (await bcrypt.compare(request.body.password, user.password)) {
            response.send("logged in");
        } else {
            response.send("failed to log in"); // wrong password
        }
    } catch {
        response.status(500).send();
    }
});

app.listen(3000);