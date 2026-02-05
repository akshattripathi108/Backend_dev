function loginUser(username, password, callback) {
    setTimeout(() => {
        console.log("User logged in:", username);
        callback({ username: username });
    }, 2000);
}

function getUserData(user, callback) {
    setTimeout(() => {
        console.log("Fetched data for user:", user.username);
        callback({ ...user, data: "lives in up inida. studies in mathura" });
    }, 2000);
}

function displayUserData(userData) {
    console.log("User Data:", userData);
}

loginUser("testUser", "password123", (user) => {
    getUserData(user, (userData) => {
        displayUserData(userData);
    });
});