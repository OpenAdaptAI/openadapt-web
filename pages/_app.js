import '@styles/globals.css'
import { Raleway } from 'next/font/google'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

const raleway = Raleway({
    subsets: ['latin'],
    variable: '--font-raleway',
})

export default function MyApp({ Component, pageProps }) {
    return (
        <main className={`${raleway.variable} font-sans`}>
            <Component {...pageProps} />
        </main>
    )
}
