# Build stage
FROM rust:latest as builder

WORKDIR /app

# Copy manifests
COPY Cargo.toml Cargo.lock ./

# Copy source code
COPY src ./src

# Build for release
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim

# Install runtime dependencies
RUN apt-get update && \
    apt-get install -y libssl3 ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Create uploads directory
RUN mkdir -p /app/uploads

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /app/target/release/Rust_meme_api /app/rust_meme_api

# Expose port
EXPOSE 8000

# Run the binary
CMD ["/app/rust_meme_api"]
