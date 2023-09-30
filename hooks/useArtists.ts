import { SimplifiedArtist } from '@spotify/web-api-ts-sdk'

export default function useArtists(artists: SimplifiedArtist[]) {
    return artists.map(artist => artist.name).join(', ')
}
