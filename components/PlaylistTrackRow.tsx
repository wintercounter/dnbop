'use client'

import { useState } from 'react'
import { PlaylistedTrack, Track } from '@spotify/web-api-ts-sdk'
import clsx from 'clsx'

import useArtists from '@/hooks/useArtists'
import { IconLoading3Quarters, IconPauseFill, IconPlayFill, IconSpotify } from '@/components/icons'

const PlayButton = ({ playing, loading }: { playing?: boolean; loading?: boolean }) => {
    return (
        <figure className={'text-[26px] inline-flex items-center justify-center w-[30px] h-[30px] mr-[15px]'}>
            {playing ? <IconPauseFill /> : <IconPlayFill />}
            {loading && <IconLoading3Quarters className={'absolute animate-spin text-[36px] text-secondary'} />}
        </figure>
    )
}

export default function PlaylistTrackRow({
    item: { track },
    onClick,
    playing,
    isCurrentTrack = false,
    href
}: {
    item: PlaylistedTrack
    playing?: boolean
    isCurrentTrack?: boolean
    onClick?: (trackId?: string, href?: string) => void
    href?: string
}) {
    const artist = useArtists((track as Track).artists)
    const [loading, setLoading] = useState(false)

    const handleClick = () => {
        if (!isCurrentTrack) {
            setLoading(true)
        }

        onClick?.(track.id || undefined, href)
    }

    return (
        <article
            className={clsx('common-box common-box-hover relative !p-0', {
                '!border-primary': playing
            })}
        >
            {isCurrentTrack ? (
                <button type={'button'} className={'p-2 flex flex-row items-center w-full text-left'} onClick={handleClick}>
                    <PlayButton playing={playing} loading={loading} />
                    <h2 className={'max-w-[calc(100%_-_120px)]'}>
                        {track.name}
                        <br /> <span className={'text-gray-500'}>{artist}</span>
                    </h2>
                </button>
            ) : (
                <a
                    className={'p-2 flex flex-row items-center'}
                    href={href}
                    onClick={ev => {
                        ev.preventDefault()
                        handleClick()
                    }}
                >
                    <PlayButton playing={playing} loading={loading} />
                    <h2 className={'max-w-[calc(100%_-_120px)]'}>
                        {track.name}
                        <br /> <span className={'text-gray-500'}>{artist}</span>
                    </h2>
                </a>
            )}
            {track.id && (
                <a
                    href={`https://open.spotify.com/track/${track.id}`}
                    title={'Open in Spotify'}
                    target={'_blank'}
                    rel={'noreferrer'}
                    className={
                        'absolute top-[50%] right-[1rem] text-[26px] translate-y-[-50%] hover:text-spotify z-[1] transition'
                    }
                >
                    <IconSpotify />
                </a>
            )}
        </article>
    )
}
