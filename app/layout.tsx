import './globals.css'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'
import { Analytics } from '@vercel/analytics/next'

const inter = Inter({ subsets: ['latin'] })

const faq = [
    [
        'What is this site?',
        'A curated collection of the best Drum and Bass and other Electronic music. Mostly DnB, but sometimes completely different genres.'
    ],
    [
        'Who is curating the volumes?',
        'I am, a random guy from the internet. The site is based on my own Spotify playlists I am collecting since 2015.'
    ],
    [
        'What volumes are?',
        'Volumes are playlists that are released quite randomly 🤣. After a while, around 30-50 songs I simply feel like it is time for a new playlist.'
    ],
    [
        'What is allstars?',
        'Allstars is a playlist that contains the very best songs from all volumes. Those really rare song that I was listening over and over again for days, and I am willing to listen to them anytime.'
    ],
    [
        'Why did you create this site?',
        <>
            It is a simple pet project just for fun, nothing serious. The source code is available on{' '}
            <a href={'https://github.com/wintercounter/dnbop'} target={'_blank'}>
                GitHub
            </a>
            .
        </>
    ]
]

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <main className="flex min-h-screen flex-col items-center md:p-[60px] w-full max-w-[1800px] m-[0_auto]">
                    {children}
                    <section className={'common-box-flat flex gap-5 w-full mt-[30px] flex-wrap'}>
                        {faq.map(([question, answer]) => (
                            <div key={question as string}>
                                <h1 className={'mb-[10px]'}>{question}</h1>
                                <p className={'text-gray-500'}>{answer}</p>
                            </div>
                        ))}
                    </section>
                </main>
                <Analytics />
            </body>
        </html>
    )
}
