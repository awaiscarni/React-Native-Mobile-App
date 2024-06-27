const express = require("express");
const App = express();
const db = require("./models");
const Port = process.env.Port || 3000;
const postRoutes = require("./routes/Posts");
const commentRoutes = require("./routes/Comments");
const userRoutes = require("./routes/User");
const likeRoutes = require("./routes/Likes");
const cors = require("cors");

App.use(express.json());
App.use(cors());

//Routes
App.use("/posts", postRoutes);
App.use("/comments", commentRoutes);
App.use("/auth", userRoutes);
App.use("/likes", likeRoutes);

db.sequelize.sync().then(() => {
  App.listen(Port, () => {
    console.log(`Serve at http://localhost:${Port}`);
  });
});

// App.get('/joke',(req,res)=>{
//     fetch(' https://pokeapi.co/api/v2/pokemon/ditto')
//   .then(response => response.json()) // Parse the response as JSON
//   .then(data => {
//     // Process the retrieved data (accessing properties of the object)
//     console.log(data); // Output: "ditto"
//     // console.log(data.abilities[0].ability.name); // Example: "limber"
//   })
//   .catch(error => {
//     console.error('Error:', error); // Handle errors
//   });

// })
// App.get('/api/jokes',(req,res)=>{
//     const data = [
//         {
//             "name":"Ali",
//             "id":3,
//             "ability":"flying"
//         },
//         {
//             "name":"Awais",
//             "id":2,
//             "ability":"flying"
//         },
//         {
//             "name":"Aleem",
//             "id":1,
//             "ability":"flying"
//         },
//         {
//             "name":"Akhtar",
//             "id":4,
//             "ability":"flying"
//         }
//     ];
//     res.send('data');
// })
