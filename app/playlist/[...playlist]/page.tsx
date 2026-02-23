// @ts-ignore
import YouTube from 'youtube-sr'
import getSpotifySdk, { getAllPlaylists } from '@/clients/spotify'
import { Playlist, PlaylistedTrack, Track } from '@spotify/web-api-ts-sdk'
import { unstable_cache } from 'next/cache'

import useArtists from '@/hooks/useArtists'
import Client from './client'
import Sidebar from '@/components/Sidebar'

const CACHE_TTL_SECONDS = 3600
const YOUTUBE_CACHE_TTL_SECONDS = 60 * 60 * 24 * 7
const YOUTUBE_VIDEO_RENDERER_REGEX = /"videoRenderer":\{"videoId":"([a-zA-Z0-9_-]{11})"/

export const revalidate = 3600

const getYoutubeIdFromResultsPage = async (query: string): Promise<string | null> => {
    const response = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&hl=en`, {
        next: { revalidate: YOUTUBE_CACHE_TTL_SECONDS }
    })

    if (!response.ok) {
        return null
    }

    const html = await response.text()
    const match = html.match(YOUTUBE_VIDEO_RENDERER_REGEX)
    return match?.[1] || null
}

const getYoutubeId = unstable_cache(
    async (artist: string, trackName: string) => {
        const query = `${artist} ${trackName}`.trim()

        if (!query) {
            return null
        }

        try {
            const [result] = await YouTube.search(query, { limit: 1 })
            return result?.id ?? null
        } catch (error) {
            console.error('YouTube lookup failed, falling back', { query, error })
            return getYoutubeIdFromResultsPage(query)
        }
    },
    ['youtube-search-by-track'],
    {
        revalidate: YOUTUBE_CACHE_TTL_SECONDS
    }
)

async function getData({ playlistId, trackId }: { playlistId?: string; trackId?: string }) {
    const spotify = await getSpotifySdk()
    const { allstars, vols } = await getAllPlaylists()
    playlistId = playlistId || vols[0].id

    const playlistData = allstars?.id === playlistId ? allstars : vols.find(item => item.id === playlistId)
    const { items } = await spotify.playlists.getPlaylistItems(playlistId)

    trackId = trackId || items.at(-1)?.track.id

    const results = {
        allstars,
        vols,
        playlistData,
        youtubeId: null,
        tracks: items,
        selectedPlaylistId: playlistId,
        selectedTrackId: trackId
    }
    const trackData = items.find((item: PlaylistedTrack) => {
        return item.track.id === trackId
    })
    const track = trackData?.track as Track | undefined

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const artist = track?.artists?.length ? useArtists(track.artists) : ''
    results.youtubeId = await getYoutubeId(artist, track?.name || '')

    return results
}

type PlaylistPageProps = {
    params?: Promise<{
        playlist?: [string?, string?]
    }>
}

export default async function PlaylistPage({ params }: PlaylistPageProps = {}) {
    const resolvedParams = params ? await params : {}
    const [playlistId, trackId] = resolvedParams.playlist || [undefined, undefined]

    const data = await getData({ playlistId, trackId })
    const { playlistData, youtubeId, tracks, vols, allstars, selectedPlaylistId, selectedTrackId } = data

    return (
        <div className={'flex flex-col xl:flex-row md:gap-[30px] w-full max-w-full'}>
            <Sidebar vols={vols} allstars={allstars} selectedPlaylistId={selectedPlaylistId} />
            <div className={'basis-full'}>
                <Client
                    playlistData={playlistData as Playlist}
                    youtubeId={youtubeId}
                    tracks={tracks}
                    selectedTrackId={selectedTrackId}
                />
            </div>
        </div>
    )
}
