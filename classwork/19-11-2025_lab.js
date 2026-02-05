// function printMessage() {
//     console.log("This is a message from the 19-11-2025_lab.js file.");
// }

// printMessage();


// let add=(a,b)=>
// {
//     return a + b;
// }

// const result = add(5, 10);
// console.log("The sum is:", result);
// let multiply=(x,y)=>
// {
//     return x * y;
// }

// const product = multiply(5, 10);
// console.log("The product is:", product);
// let divide=(x, y)=>
// {
//     return x / y;
// }
// const quotient = divide(10, 2);
// console.log("The quotient is:", quotient);
// let subtract=(a, b)=>
// {
//     return a - b;
// }
// const difference = subtract(10, 5);
// console.log("The difference is:", difference);
// let square=(n)=>
// {
//     return n * n;
// }
// const squaredValue = square(4);
// console.log("The squared value is:", squaredValue);
// function Person(name, age) {
//     this.name = name;
//     this.age = age;
// }
// Person.prototype.greet = function() {
//     console.log("Hello, my name is " + this.name, "and I am " + this.age + " years old.");
// };

// const person1 = new Person("Alice", 30);
// console.log("Person 1:", person1);
// const person2 = new Person("Bob", 25);
// console.log("Person 2:", person2);
// person1.greet();
// person2.greet();
// class calculator {
//     constructor() {}

//     add(a, b) {            //function chain method.
//         return a + b;
//     }

//     subtract(a, b) {
//         return a - b;
//     }

//     multiply(a, b) {
//         return a * b;
//     }

//     divide(a, b) {
//         if (b !== 0) {
//             return a / b;
//         } else {
//             return "Error: Division by zero";
//         }
//     }
// }

// const calc = new calculator();
// console.log("Addition:", calc.add(10, 5));
// console.log("Subtraction:", calc.subtract(10, 5));
// console.log("Multiplication:", calc.multiply(10, 5));
// console.log("Division:", calc.divide(10, 5));
// console.log("Division by zero:", calc.divide(10, 0));
// class product {
//     constructor(name, price) {
//         this.name = name;
//         this.price = price;
//         this.category = "General";
//     }

//     displayInfo() {
//         console.log("Product Name:", this.name);
//         console.log("Product Price:", this.price);
//         console.log("Product Category:", this.category);
//     }
//     discountedPrice(discountPercentage) {
//         const discountAmount = (this.price * discountPercentage) / 100;
//         return this.price - discountAmount;
//     }
// }
// const product1 = new product("Laptop", 1500);
// product1.displayInfo();
// console.log("Discounted Price:", product1.discountedPrice(10));
// const product2 = new product("Smartphone", 800);
// product2.displayInfo();
// console.log("Discounted Price:", product2.discountedPrice(15));
// const product3 = new product("Headphones", 200);
// product3.displayInfo();
// console.log("Discounted Price:", product3.discountedPrice(20));

// setTimeout(() => {
//     console.log("Rice");
// }, 2000);

// console.log("Maggie");
// function calculate(a,b,callback) {
//     let sum = a + b;
//     callback(sum);
// }
// calculate(5, 10, function(result) {
//     console.log("The sum is:", result);
// });
