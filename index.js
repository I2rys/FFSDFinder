//Dependencies
const Path = require("path")
const Fs = require("fs")

//Variables
const Self_Args = process.argv.slice(2)

//Functions
function walk(dir, done) { //Not mine :)
    var results = [];
    Fs.readdir(dir, function(err, list) {
      if (err) return done(err);
      var pending = list.length;
      if (!pending) return done(null, results);
      list.forEach(function(file) {
        file = Path.resolve(dir, file);
        Fs.stat(file, function(err, stat) {
          if (stat && stat.isDirectory()) {
            walk(file, function(err, res) {
              results = results.concat(res);
              if (!--pending) done(null, results);
            });
          } else {
            results.push(file);
            if (!--pending) done(null, results);
          }
        });
      });
    });
  };

//Main
if(!Self_Args.length){
    console.log(`node index.js <directory>
Example: node index.js ./test_directory`)
    process.exit()
}

if(!Self_Args[0]){
    console.log("Invalid directory.")
    process.exit()
}

walk(Self_Args[0], function(err, files){
    for( i in files ){
        if(files[i] != ""){
            const data = Fs.readFileSync(files[i], "utf8")

            if(data.indexOf("SQLite format") != -1){
                console.log(`${files[i]} is a SQLite database.`)
            }
        }
    }

    console.log("Done.")
    process.exit()
})
