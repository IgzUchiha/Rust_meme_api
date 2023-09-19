#[derive(Serialize)]
pub struct Meme {
    id: i32,
    caption: String,
    tags: String,
    image: String,
    // user_id: i32,
}

pub fn memes() -> Vec<Meme> {
    vec![
        Meme {
            id: 1,
            caption: "Troll Face".to_string(),
            tags: "classic".to_string(),
            image: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9a/Trollface_non-free.png/220px-Trollface_non-free.png".to_string(),
            // user_id: 1,
        },
        Meme {
            id: 2,
            caption: "meme2".to_string(),
            tags: "classic, hilarious".to_string(),
            image: "some picture".to_string(),
            // user_id: 1,
        },
        Meme {
            id: 3,
            caption: "meme3".to_string(),
            tags: "funny".to_string(),
            image: "a picture".to_string(),
            // user_id: 2,
        },
        Meme {
            id: 4,
            caption: "meme4".to_string(),
            tags: "absolutely bonkers".to_string(),
            image: "another picture".to_string(),
            // user_id: 2,
        },
    ]
}