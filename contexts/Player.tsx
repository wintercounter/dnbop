import { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from 'react'
import type { YouTubePlayer } from 'react-youtube'

type PlayerContextState = {
    playing: boolean
    api: YouTubePlayer
    ready: boolean
}

type PlayerContext = [PlayerContextState, Dispatch<SetStateAction<PlayerContextState>>]

const Context = createContext<PlayerContext>([{ playing: false, api: null, ready: false }, () => {}])

export const PlayerContextProvider = ({ children }: PropsWithChildren) => {
    const value = useState({
        playing: false,
        api: null,
        ready: false
    })
    return <Context.Provider value={value}>{children}</Context.Provider>
}

export const usePlayerContext = () => {
    return useContext(Context)
}
