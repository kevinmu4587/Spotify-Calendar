# Spotify Podcast Search
A frontend website written in Vue 3 using the composition API to allow users to search for real Spotify podcasts, select them, and view the latest episodes in a calendar format.

## API Setup
Spotify API requires a bearer token to work. To get the token, run this command:
```
curl -X POST "https://accounts.spotify.com/api/token" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "grant_type=client_credentials&client_id=<CLIENT_ID>&client_secret=<CLIENT_SECRET>"
```
Client ID and client secret can be obtained from the Spotify app manager.
The bearer token should go inside a file called `.env` with the following format.
```
VITE_SPOTIFY_TOKEN=<Bearer token>
```
 **Do not share or commit the bearer token anywhere!**



## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
