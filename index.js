const express = require("express");
const fs = require('fs')
const users = require("./MOCK_DATA.json");

const app = express();
const PORT = 8000;

//Middleware
app.use(express.urlencoded({extended: false}));

// GET / users - List of all users [JSON FILE]
app.get("/api/users", (req, res) => {
    return res.json(users);
});

// GET / users - List of all users [HTML FILE]
app.get("/users", (req, res) => {
    const html  = `
    <ul>
        ${users.map((user) => `<Li>${user.first_name}</Li>`).join("")}
    </ul>
    `;
    res.send(html);
});


// GET / users/1 - Get the User with ID 1 (Make Dynamic path)

// app.get("/api/users/:id", (req, res) => {
//     const id = Number(req.params.id);
//     const user = users.find((user) => user.id === id);
//     return res.json(user);
// });



// Grouping for Same routes
app.route('/api/users/:id').get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
 })
 .put((req,res) => {
    const userIndex = users.findIndex(u => u.id === Number(req.params.id));
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...req.body };
            fs.writeFileSync('./MOCK_DATA.json', JSON.stringify(users));
            res.json({ status: "Success", user: users[userIndex] });
        } else {
            res.status(404).json({ error: "User not found" });
        }
 })
 .delete((req,res) => {
    const userIndex = users.findIndex(u => u.id === Number(req.params.id));
        if (userIndex !== -1) {
            users.splice(userIndex, 1);
            fs.writeFileSync('./MOCK_DATA.json', JSON.stringify(users));
            res.json({ status: "Success", message: "User deleted" });
        } else {
            res.status(404).json({ error: "User not found" });
        } 
 });


 // POST / users - create new users

app.post("/api/users", (req,res) => {
    const body = req.body;
    users.push({...body, id: users.length + 1});
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data) => {
        return res.json({status: "Success", id: users.length });
    }); 
});

app.listen(PORT, () => console.log(`Server Started at PORT : ${PORT}`));
