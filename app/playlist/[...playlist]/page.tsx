// @ts-ignore
import YouTube from 'youtube-sr'
import getSpotifySdk, { getAllPlaylists } from '@/clients/spotify'
import { Playlist, PlaylistedTrack, Track } from '@spotify/web-api-ts-sdk'

import useArtists from '@/hooks/useArtists'
import Client from './client'
import Sidebar from '@/components/Sidebar'

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

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const artist = useArtists((trackData?.track as Track).artists)
    const [{ id }] = await YouTube.search(`${artist} ${trackData?.track.name}`, { limit: 1 })
    results.youtubeId = id

    return results
}

export default async function PlaylistPage({ params: { playlist: [playlistId, trackId] = [undefined, undefined] } }) {
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
