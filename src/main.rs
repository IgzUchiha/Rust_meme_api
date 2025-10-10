use actix_web::{web, App, HttpResponse, HttpServer, Responder, middleware};
use actix_cors::Cors;
use actix_files as fs;
use actix_multipart::Multipart;
use futures_util::stream::StreamExt as _;
use serde::{Deserialize, Serialize};
use std::io::Write;
use std::sync::Mutex;

#[derive(Serialize, Deserialize, Clone)]
pub struct Meme {
    id: i32,
    caption: String,
    tags: String,
    image: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    evm_address: Option<String>,
    #[serde(default)]
    likes: i32,
    #[serde(default)]
    comment_count: i32,
}

// In-memory storage for demo purposes
struct AppState {
    memes: Mutex<Vec<Meme>>,
    next_id: Mutex<i32>,
}

// Health check endpoint
async fn health_check() -> impl Responder {
    HttpResponse::Ok().json(serde_json::json!({
        "status": "ok",
        "message": "Rust Meme API is running!",
        "version": "1.0.0"
    }))
}

async fn get_memes(data: web::Data<AppState>) -> impl Responder {
    let memes = data.memes.lock().unwrap();
    let mut sorted_memes = memes.clone();
    // Sort by popularity: likes + comment_count (descending)
    sorted_memes.sort_by(|a, b| {
        let score_a = a.likes + a.comment_count;
        let score_b = b.likes + b.comment_count;
        score_b.cmp(&score_a)
    });
    HttpResponse::Ok().json(sorted_memes)
}

async fn like_meme(
    path: web::Path<i32>,
    data: web::Data<AppState>,
) -> impl Responder {
    let meme_id = path.into_inner();
    let mut memes = data.memes.lock().unwrap();
    
    if let Some(meme) = memes.iter_mut().find(|m| m.id == meme_id) {
        meme.likes += 1;
        HttpResponse::Ok().json(meme.clone())
    } else {
        HttpResponse::NotFound().json(serde_json::json!({
            "error": "Meme not found"
        }))
    }
}

async fn upload_meme(
    mut payload: Multipart,
    data: web::Data<AppState>,
) -> Result<HttpResponse, actix_web::Error> {
    let mut caption = String::new();
    let mut tags = String::new();
    let mut image_url = String::new();
    let mut evm_address: Option<String> = None;

    // Process multipart form data
    while let Some(item) = payload.next().await {
        let mut field = item?;
        let content_disposition = field.content_disposition();
        let field_name = content_disposition.get_name().unwrap_or("");

        match field_name {
            "caption" => {
                while let Some(chunk) = field.next().await {
                    let data = chunk?;
                    caption.push_str(std::str::from_utf8(&data).unwrap_or(""));
                }
            }
            "tags" => {
                while let Some(chunk) = field.next().await {
                    let data = chunk?;
                    tags.push_str(std::str::from_utf8(&data).unwrap_or(""));
                }
            }
            "image_url" => {
                while let Some(chunk) = field.next().await {
                    let data = chunk?;
                    image_url.push_str(std::str::from_utf8(&data).unwrap_or(""));
                }
            }
            "evm_address" => {
                let mut addr = String::new();
                while let Some(chunk) = field.next().await {
                    let data = chunk?;
                    addr.push_str(std::str::from_utf8(&data).unwrap_or(""));
                }
                if !addr.is_empty() {
                    evm_address = Some(addr);
                }
            }
            "image" => {
                // Handle file upload - save to uploads directory
                let filename = content_disposition
                    .get_filename()
                    .unwrap_or("upload.jpg")
                    .to_string();
                
                let filepath = format!("./uploads/{}", filename);
                
                // Create uploads directory if it doesn't exist
                std::fs::create_dir_all("./uploads").ok();
                
                let mut f = std::fs::File::create(&filepath)?;
                while let Some(chunk) = field.next().await {
                    let data = chunk?;
                    f.write_all(&data)?;
                }
                
                // Return the API URL for the uploaded file
                image_url = format!("http://127.0.0.1:8000/uploads/{}", filename);
            }
            _ => {}
        }
    }

    // Create new meme
    let mut next_id = data.next_id.lock().unwrap();
    let id = *next_id;
    *next_id += 1;
    drop(next_id);

    let new_meme = Meme {
        id,
        caption,
        tags,
        image: image_url,
        evm_address,
        likes: 0,
        comment_count: 0,
    };

    let mut memes = data.memes.lock().unwrap();
    memes.push(new_meme.clone());
    drop(memes);

    Ok(HttpResponse::Ok().json(new_meme))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Initialize with some sample memes
    let initial_memes = vec![
        Meme {
            id: 1,
            caption: "Doge".to_string(),
            tags: "classic, crypto".to_string(),
            image: "https://i.kym-cdn.com/entries/icons/original/000/013/564/doge.jpg".to_string(),
            evm_address: Some("0x39D0F19273036293764262aCb5115F223aEF8f79".to_string()),
            likes: 12,
            comment_count: 3,
        },
        Meme {
            id: 2,
            caption: "Pepe the Frog".to_string(),
            tags: "classic, rare".to_string(),
            image: "https://i.kym-cdn.com/entries/icons/original/000/017/618/pepefroggie.jpg".to_string(),
            evm_address: Some("0x2555ea784eBDb81C1704f8b749Dbbc68aDaCB723".to_string()),
            likes: 8,
            comment_count: 1,
        },
    ];

    let app_state = web::Data::new(AppState {
        memes: Mutex::new(initial_memes),
        next_id: Mutex::new(3),
    });

    // Get port from environment variable or default to 8000
    let port = std::env::var("PORT").unwrap_or_else(|_| "8000".to_string());
    let bind_address = format!("0.0.0.0:{}", port);
    
    println!("🚀 Server starting on {}", bind_address);
    println!("📁 Uploads will be saved to ./uploads/");
    
    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);

        App::new()
            .app_data(app_state.clone())
            .wrap(cors)
            .wrap(middleware::Logger::default())
            .route("/", web::get().to(health_check))
            .route("/health", web::get().to(health_check))
            .route("/memes", web::get().to(get_memes))
            .route("/memes", web::post().to(upload_meme))
            .route("/memes/{id}/like", web::post().to(like_meme))
            // Serve uploaded files
            .service(fs::Files::new("/uploads", "./uploads").show_files_listing())
    })
    .bind(&bind_address)?
    .run()
    .await
}