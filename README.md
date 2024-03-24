# TuneStreamer 🎶

TuneStreamer is a web music application desinged and built in 3 weeks as a portfolio project for the completion of the ALX backend specialization track. This application is designed based on the RESTFUL APIs architecture and uses session-based authentication.

## Key Features

- User authentication with session-based authentication.
- Search, play, and pause favorite music tracks.
- Admin panel for ultimate control over users and music.
- CRUD operation for music and RUD(read, update, delete) operations for users.

## Installation

1. Clone the repository to your local machine:

   ```
   $ https://github.com/Bantamlak12/tunestreamer.git
   ```

2. Navigate to the project directory:

   ```
   $ cd tunestreamer
   ```

3. Install dependencies using `npm`:

   ```
   $ npm install
   ```

4. Create `config.env` file in the root directory with the following environment variables:

   ```
   NODE_ENV=development
   PORT=3000
   DATABASE=your_mongodb_atlas_connection_string
   DATABASE_LOCAL=mongodb://localhost:27017/tunestreamer
   DATABASE_PASSWORD=your_mongodb_atlas_connection_password
   SECRET_KEY=your_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   CALL_BACK_URL=your_google_call_back_url
   ```

## Usage Guide

1. Start the development server
   ```
   $ npm run dev
   ```
2. Access the application at `http://localhost:3000/` in your browser

## Contribution Guidelines

I really welcome contributions to TuneStreamer. Please follow this guidelines:

- Fork the repository and create a new branch for your feature or bug fix.
- Write clear, concise, and well-documented code.
- Test your changes thoroughly and ensure they do not break existing functionality.
- Submit a pull request with a detailed description of your changes.

## License Info

This project is licensed under the MIT License. See the [LICENSE](https://opensource.org/license/mit) file for details.

Thank you for choosing TuneStreamer! I hope you enjoy my music streaming platform. If you have any questions or feedback, please don't hesitate to reach out. Happy coding! 😊
