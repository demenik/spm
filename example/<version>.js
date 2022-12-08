// This is the file that gets imported by spm

// You can import other modules here too:
const spm = importModule("spm")
const module = spm.import("...")


// Define your functions and classes here:
function myFunction() {
  // ...
}

class MyClass {
  // ...
}


/* You need to export the classes and functions you
   want to be accessible to the importing script */
module.exports = {
  myFunction,
  MyClass
}