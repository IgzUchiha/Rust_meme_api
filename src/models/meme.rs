use diesel::prelude::*;
use diesel::pg::PgConnection;
use diesel::r2d2::{ConnectionManager, Pool};
use dotenv::dotenv;
use std::env;
#[macro_use]
extern crate diesel;
pub mod schema {
    table! {
        memes (id) {
            id -> Int4,
            caption -> Varchar,
            tags -> Varchar,
            image -> Varchar,
        }
    }
}

#[derive(Queryable, Insertable)]
#[table_name = "memes"]
pub struct Meme {
    pub id: i32,
    pub caption: String,
    pub tags: String,
    pub image: String,
}