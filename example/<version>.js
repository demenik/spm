// This is the file that gets imported by spm

// You can import other modules here too:
const spm = await importModule("spm-wrapper")("0.0.7");
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