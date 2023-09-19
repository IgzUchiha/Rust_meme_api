#[macro_use]
extern crate diesel;

use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use actix_web::http::StatusCode;
use serde::Serialize;
use std::env;
use serde::Deserialize;

mod models; // Add this line to import the models module

// ...

#[derive(Serialize)]
pub struct Meme {
    id: i32,
    caption: String,
    tags: String,
    image: String,
    // user_id: i32,
}

// ...

async fn memes() -> impl Responder {
    // Here you would interact with your database to get the memes.
    // This is a placeholder implementation.
    let memes = models::meme::memes(); // Assuming the memes function is in the meme module
    HttpResponse::Ok().json(memes) // Return the memes as JSON
}

// ...

// Add the main function
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .route("/memes", web::get().to(memes))
    })
    .bind("127.0.0.1:8000")?
    .run()
    .await
}