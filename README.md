<!-- SHIELDS -->
<p align="center">
    <a href="https://github.com/salvia-dev/crypeeto-api/graphs/contributors" alt="Contributors">
        <img src="https://img.shields.io/github/contributors/salvia-dev/crypeeto-api" /></a>
    <a href="https://github.com/salvia-dev/crypeeto-api/pulse" alt="Activity">
        <img src="https://img.shields.io/github/commit-activity/m/salvia-dev/crypeeto-api" /></a>
</p>

<!-- PROJECT LOGO -->
<p align="center">
  <h1 align="center">Crypeeto API</h1>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

This repository was created in order to get my front-end web app "Crypeeto" working correctly under different circumstances and to show my skills which I have acquired in the last few years. For the time being, I am trying to adapt myself to best practices and keep my code VERY VERY clean.

### Built With

- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [mongoose](https://mongoosejs.com/)
- [chai](https://www.chaijs.com/)
- [mocha](https://mochajs.org/)
- [RandExp](https://www.npmjs.com/package/randexp)
- [bcrypt](https://www.npmjs.com/package/bcryptjs)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

<!-- GETTING STARTED -->

### Installation

1. Get your free API Key for crypto data at [https://twelvedata.com/](https://twelvedata.com/) and for the news at [https://cryptonews-api.com/](https://cryptonews-api.com/)
2. Create your own MongoDB database at [https://www.mongodb.com/](https://www.mongodb.com/)
3. Clone the repository
   ```sh
   git clone https://github.com/salvia-dev/crypeeto-api.git
   ```
4. Install packages with yarn
   ```sh
   yarn install
   ```
5. Get into the folder
   ```sh
   cd crypeeto-api
   ```
6. Create a `.env` file under the src folder
   ```sh
   cd src && touch .env
   ```
7. Insert your `dotenv` variables in the provided format
   ```
   PORT=<your_port>
   TWELVE_DATA_API_KEY=<crypto_api_key>
   CRYPTO_NEWS_API_KEY=<news_api_key>
   MONGO_DATABASE_URI=<your_mongodb_uri>
   ```

<!-- USAGE EXAMPLES -->

## Usage

I don't know whether it will be useful for anyone but I created that for my personal purposes.

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->

## Contact

Dawid Bytys - salviadev@protonmail.com

Project Link: [https://github.com/salvia-dev/crypeeto-api](https://github.com/salvia-dev/crypeeto-api)
