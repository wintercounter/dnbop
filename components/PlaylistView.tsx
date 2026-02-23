'use client'

import Image from 'next/image'
import { Playlist, PlaylistedTrack } from '@spotify/web-api-ts-sdk'
import { usePathname, useRouter } from 'next/navigation'
import clsx from 'clsx'

import PlaylistTrackRow from '@/components/PlaylistTrackRow'
import { IconSpotify } from '@/components/icons'
import { usePlayerContext } from '@/contexts/Player'

function PlaylistView({
    item,
    tracks = [],
    title = true,
    expanded = false,
    selectedTrackId
}: {
    item: Playlist & { vol?: number }
    tracks?: PlaylistedTrack[]
    title?: boolean | string
    expanded?: boolean
    selectedTrackId?: string
}) {
    const pathname = usePathname()
    const router = useRouter()
    const [{ playing, api }, setPlayerState] = usePlayerContext()
    const firstItem = tracks.at(-1) as PlaylistedTrack
    const updatedAt = new Date(firstItem.added_at)
    const formattedUpdatedAt = updatedAt.toISOString().split('T')[0]
    const handleClick = (trackId?: string, href?: string) => {
        if (trackId === selectedTrackId) {
            if (!api) {
                return
            }

            if (playing) {
                api.pauseVideo()
            } else {
                api.playVideo()
            }
            return
        }

        if (!href) {
            return
        }

        router.push(href, {
            scroll: !pathname.startsWith('/playlist')
        })

        setPlayerState(prevState => ({
            ...prevState,
            ready: false
        }))
    }

    return (
        <article className={'flex flex-col sm:flex-row w-full space-around gap-[15px] common-box-flat'}>
            <div
                className={'flex flex-col items-center sm:sticky sm:items-start top-[1rem] h-fit sm:w-[300px] shrink-0'}
            >
                {title && (
                    <div className={'flex items-center gap-[8px]'}>
                        <h1 className={'w-fit uppercase font-[800] text-[32px] rainbow-text whitespace-nowrap uppercase'}>
                            {typeof title === 'string' ? title : `Vol ${item.vol}`}
                        </h1>
                        <a
                            href={`https://open.spotify.com/playlist/${item.id}`}
                            title={`Open ${item.name} in Spotify`}
                            aria-label={`Open ${item.name} in Spotify`}
                            target={'_blank'}
                            rel={'noreferrer'}
                            className={'text-[26px] hover:text-spotify transition'}
                        >
                            <IconSpotify />
                        </a>
                    </div>
                )}
                <time className={'text-gray-600 mb-[15px]'}>Updated at {formattedUpdatedAt}</time>
                <Image
                    src={item.images[0].url}
                    alt={item.name}
                    width={item.images[0].width}
                    height={item.images[0].height}
                    loading={'lazy'}
                    className={'w-full max-w-[300px] max-h-[300px] common-box !p-0'}
                />
            </div>
            <div
                className={clsx('flex flex-col grow', {
                    'max-h-[300px]': !expanded
                })}
            >
                <div
                    className={clsx('max-h-full', {
                        'overflow-auto': !expanded
                    })}
                >
                    <div className={'flex flex-col-reverse gap-[8px]'}>
                        {tracks.map((trackItem, index) => {
                            const trackSlug = trackItem.track.id || String(index)
                            const isCurrentTrack =
                                selectedTrackId === trackItem.track.id || selectedTrackId === String(index)
                            const isPlaying =
                                playing &&
                                (selectedTrackId === trackItem.track.id || selectedTrackId === String(index))
                            return (
                                <PlaylistTrackRow
                                    key={trackItem.track.id || trackItem.track.name}
                                    item={trackItem}
                                    playing={isPlaying}
                                    isCurrentTrack={isCurrentTrack}
                                    href={`/playlist/${item.id}/${trackSlug}`}
                                    onClick={handleClick}
                                />
                            )
                        })}
                    </div>
                </div>
            </div>
        </article>
    )
}

export default PlaylistView
