use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use std::env;
use serde::Deserialize;

#[derive(Deserialize)]
pub struct Info {
    id: i32,
    // Add other fields here
}

async fn index() -> impl Responder {
    "Welcome to Meme4Me"
}

async fn memes() -> impl Responder {
    // Here you would interact with your database to get the memes.
    // This is a placeholder implementation.
    HttpResponse::Ok().body("Memes")
}

async fn edit_meme(info: web::Json<Info>) -> impl Responder {
    // Your existing edit_meme function
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    // let jwt_secret = env::var("JWT_SECRET").expect("JWT_SECRET must be set");

    HttpServer::new(|| {
        App::new()
            .route("/", web::get().to(index))
            .route("/memes", web::get().to(memes))
            .route("/memes/{id}", web::put().to(edit_meme))
            // Add your other routes here
    })
    .bind("127.0.0.1:3200")?
    .run()
    .await
}