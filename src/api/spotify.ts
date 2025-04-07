import type { SpotifyShow, SpotifyShowEpisode, SpotifyShowEpisodes } from './spotify_interface'

const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1'
const accessToken = import.meta.env.VITE_SPOTIFY_TOKEN

// https://developer.spotify.com/documentation/web-api/tutorials/getting-started#request-an-access-token

/**
 * Returns a list of 20 Spotify podcasts.
 *
 * @param query the search query to filter podcasts by
 * @returns
 */
export async function searchPodcasts(query: string): Promise<SpotifyShow[]> {
  const params = new URLSearchParams({
    q: query,
    type: 'show',
    market: 'US',
    limit: '20',
  })

  const res = await fetch(`${SPOTIFY_API_BASE_URL}/search?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!res.ok) {
    throw new Error(`Spotify API error: ${res.status}`)
  }

  const data = await res.json()
  console.log(data.shows.items)
  return data.shows.items
}

/**
 * Returns the latest release date for a show specified by showId
 *
 * @param showId the id of the show
 * @returns (string) the release date
 */
export async function getLatestEpisodes(
  showId: string,
  numEpisodes: number,
): Promise<SpotifyShowEpisode[]> {
  const res = await fetch(
    `${SPOTIFY_API_BASE_URL}/shows/${showId}/episodes?market=US&limit=${numEpisodes}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  )

  if (!res.ok) {
    console.error(`Failed to fetch episodes for show ${showId}:`, res.statusText)
    throw new Error(`Spotify API error: ${res.status}`)
  }

  const data: SpotifyShowEpisodes = await res.json()
  console.log('Release date result is: ', data.items)

  const latestEpisodes: SpotifyShowEpisode[] = data.items
  return latestEpisodes.filter((show) => show != null)
}
