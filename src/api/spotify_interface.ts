export interface SpotifyImage {
  height: number
  width: number
  url: string
}

export interface SpotifyShowExternalUrl {
  spotify: string
}

export interface SpotifyShow {
  description: string
  id: string
  images: SpotifyImage[]
  name: string
  publisher: string
  total_episodes: number
  latest_episodes: SpotifyShowEpisode[]
  uri: string
  external_urls: SpotifyShowExternalUrl
}

export interface SpotifyShowEpisode {
  name: string
  images: SpotifyImage[]
  description: string
  release_date: string
  external_urls: SpotifyShowExternalUrl
}

export interface SpotifyShowEpisodes {
  items: SpotifyShowEpisode[]
}