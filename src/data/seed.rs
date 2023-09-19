use diesel::prelude::*;
use dotenv::dotenv;
use std::env;

use crate::models::{NewMeme, NewUser, Meme, User};
use crate::schema::{users, memes};
use crate::db::establish_connection;

pub fn seed() {
    dotenv().ok();
    let connection = establish_connection();

    let users_data = crate::data::users::users();
    let memes_data = crate::data::memes::memes();

    for user in users_data {
        let hashed_password = bcrypt::hash(&user.password, 9).unwrap();
        let new_user = NewUser {
            first_name: &user.first_name,
            last_name: &user.last_name,
            username: &user.username,
            password: &hashed_password,
            is_admin: user.is_admin,
        };

        diesel::insert_into(users::table)
            .values(&new_user)
            .execute(&connection)
            .expect("Error saving new user");
    }

    for meme in memes_data {
        let new_meme = NewMeme {
            caption: &meme.caption,
            tags: &meme.tags,
            image: &meme.image,
            user_id: meme.user_id,
        };

        diesel::insert_into(memes::table)
            .values(&new_meme)
            .execute(&connection)
            .expect("Error saving new meme");
    }
}