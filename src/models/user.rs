use diesel::prelude::*;
use diesel::pg::PgConnection;
use diesel::r2d2::{ConnectionManager, Pool};
use dotenv::dotenv;
use std::env;
#[macro_use]

pub mod schema {
    table! {
        users (id) {
            id -> Int4,
            first_name -> Varchar,
            last_name -> Varchar,
            username -> Varchar,
            password -> Varchar,
            is_admin -> Bool,
        }
    }
}

#[derive(Queryable, Insertable)];
#[diesel(table_name = "users")];
pub struct User {
    pub id: i32,
    pub first_name: String,
    pub last_name: String,
    pub username: String,
    pub password: String,
    pub is_admin: bool,
}