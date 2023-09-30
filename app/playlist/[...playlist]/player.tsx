import { useInView } from 'react-intersection-observer'
import YouTubePlayer, { YouTubeProps } from '@/pkg/react-youtube'
import { usePlayerContext } from '@/contexts/Player'
import clsx from 'clsx'

const Player = (props: YouTubeProps) => {
    const { ref, inView } = useInView({
        initialInView: true,
        rootMargin: '0px 0px 5000px 0px'
    })
    const [, setPlayerState] = usePlayerContext()

    return (
        <>
            <div className={'sticky top-0 z-[2] sm:relative w-full aspect-video'}>
                <YouTubePlayer
                    className={clsx('static z-[1] common-box-flat aspect-video top-0 youtubeContainer w-full', {
                        'sm:fixed sm:top-[calc(385px_+_2rem)] sm:ml-[16px] sm:!w-[300px] sm:!h-[168px] sm:!pb-0':
                            !inView
                    })}
                    {...props}
                    onReady={ev => {
                        setPlayerState(prevState => ({
                            ...prevState,
                            api: ev.target,
                            ready: true
                        }))
                    }}
                    onPlay={() => {
                        setPlayerState(prevState => ({
                            ...prevState,
                            playing: true
                        }))
                    }}
                    onPause={() => {
                        setPlayerState(prevState => ({
                            ...prevState,
                            playing: false
                        }))
                    }}
                />
            </div>
            <div ref={ref} className={'md:mt-[30px]'} />
        </>
    )
}

export default Player
