let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let fs = require("fs");

app.use(bodyParser.urlencoded({ extended: true }));
let users = [];
try {
  let data = fs.readFileSync("users.json", "utf8");
  if (data) { // Parsing the data from users.json and storing it in the 'users' array
    users = JSON.parse(data);
  }
} catch (err) {
  console.error("Fel vid läsning av filen:", err);
}
// Route for sending the HTML form to the client
app.get("/", (req, res) => {
    let output = "";
    if (users && users.length > 0) {
      for (let i = 0; i < users.length; i++) {
        output += `<p><br>
        Name: ${users[i].name}<br> 
        Email: ${users[i].email}  <br/>
        Phone: ${users[i].phone}  <br/>
        Comment: ${users[i].comment}</p>`;
      }
    }
    let html = fs.readFileSync(__dirname + "/guestbook.html").toString();
    html = html.replace("GUEST", output);
    res.send(html);
  });
  
  // Route for handling POST requests from the form
  app.post("/submit-form", (req, res) => {
    let { name, email, phone, comment } = req.body;  // Extracting form data from the request body
    users.push({ name, email, phone, comment }); // Adding a new user object to the 'users' array
  
    // Writing user information to the users.json file
    fs.writeFile("users.json", JSON.stringify(users), (err) => {
      if (err) {
        console.error("Error writing to the file:", err);
        return res.status(500).send("Server error");
      }
      // Redirecting the client back to the main page after submitting the form
      res.redirect("/");
    });
  });
  
// Route to display all users as JSON
app.get("/users", (req, res) => {
  res.json(users);
});

// Configuring the server to listen on port 8080
let PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});