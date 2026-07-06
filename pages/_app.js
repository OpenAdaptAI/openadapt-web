import '@styles/globals.css'
import { Raleway } from 'next/font/google'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import Head from 'next/head'
import Script from 'next/script'

const raleway = Raleway({
    subsets: ['latin'],
    variable: '--font-raleway',
})

export default function MyApp({ Component, pageProps }) {
    return (
        <>
            {/* New pages must add their own <Head> with unique title, description, canonical, and og:* tags */}
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>OpenAdapt.AI — AI-Powered Desktop Automation Platform</title>
                <meta
                    name="description"
                    content="Open-source platform for GUI automation with AI. Record human demonstrations, train models, and deploy agents that operate any desktop software. Works with Claude, GPT-4V, Gemini. MIT licensed."
                />
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/apple-touch-icon.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicon-16x16.png"
                />
                <link rel="manifest" href="/site.webmanifest" />
                <link
                    rel="mask-icon"
                    href="/safari-pinned-tab.svg"
                    color="#000000"
                />
                <meta name="msapplication-TileColor" content="#2b5797" />
                <meta name="theme-color" content="#ffffff" />

                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="OpenAdapt.AI" />
                <meta property="og:title" content="OpenAdapt.AI — Teach AI to Use Any Software" />
                <meta property="og:description" content="Open-source AI-powered desktop automation. Record demonstrations, train models, deploy agents. Works with Claude, GPT-4V, Gemini. MIT licensed." />
                <meta property="og:image" content="https://openadapt.ai/og.png" />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="1024" />
                <meta property="og:image:height" content="1024" />
                <meta property="og:url" content="https://openadapt.ai" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@OpenAdaptAI" />
                <meta name="twitter:title" content="OpenAdapt.AI — Teach AI to Use Any Software" />
                <meta name="twitter:description" content="Open-source AI-powered desktop automation. Record demonstrations, train models, deploy agents. MIT licensed." />
                <meta name="twitter:image" content="https://openadapt.ai/og.png" />

                {/* Google tag (gtag.js) */}
                <script
                    async
                    src="https://www.googletagmanager.com/gtag/js?id=G-CJ01Y19XJN"
                ></script>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-CJ01Y19XJN');
            `,
                    }}
                />
            </Head>
            <main className={`${raleway.variable} font-sans`}>
                <Component {...pageProps} />
            </main>
            <Script src="https://buttons.github.io/buttons.js" />
        </>
    )
}
