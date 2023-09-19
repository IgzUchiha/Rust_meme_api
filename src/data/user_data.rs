// structure that represents a User 
pub struct User {
    id: i32,
    first_name: String,
    last_name: String,
    username: String,
    password: String,
    is_admin: bool,
}
//Function that returns a vector of User Instances
//vec! is a macro that creates a vector. This is equivalent to the array literal [] in JavaScript.
pub fn users() -> Vec<User> {
    vec![
        User {
            id: 1,
            first_name: "Jolly".to_string(),
            last_name: "Bee".to_string(),
            username: "JollyB".to_string(),
            password: "12345".to_string(),
            is_admin: true,
        },
        User {
            id: 2,
            first_name: "Mac".to_string(),
            last_name: "Sauce".to_string(),
            username: "BigMac".to_string(),
            password: "12345".to_string(),
            is_admin: false,
        },
        User {
            id: 3,
            first_name: "Simp".to_string(),
            last_name: "Body".to_string(),
            username: "BigSimp".to_string(),
            password: "12345".to_string(),
            is_admin: true,
        },
    ]
}