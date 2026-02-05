const fs = require("fs");
const{Transform} = require("stream")



// file read -> data goes into chunk -> convert into string -> to uppercase
const uppercase = new Transform({
    transform(chunk , encoding, callback){
        let uppercase = chunk.toString().toUpperCase();
        callback(null, uppercase);
    }
})

const vowels = new Transform({
    transform(chunk , encoding, callback){
        let vowels = chunk.toString().replace(/[aeiou]/gi, "*");
        callback(null, vowels);
    }
})



const readstream = fs.createReadStream("inputfile1.txt")

// const writestream = fs.createWriteStream("copiedfile1.txt")
const writestream = fs.createWriteStream("uppercasefile1.txt")


//copyfile
readstream.pipe(uppercase).pipe(vowels).pipe(writestream)