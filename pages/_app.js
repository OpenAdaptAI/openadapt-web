import '@styles/globals.css'
import { Raleway } from 'next/font/google'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import Head from 'next/head';
import Script from 'next/script';

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
})

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>OpenAdapt.AI</title>
        <meta name="description" content="AI for Humans. No programming required."/>
        <meta name="description" content="OpenAdapt.AI - AI for Humans. Open source infrastructure for using Large Language Models (LLMs), Large Multimodal Models (LMMs) / Visual Language Models (VLMs), and Large Action Models (LAMs) to automate your desktop application workflows. Record, replay, and share. No programming required."/>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="manifest" href="/site.webmanifest"/>
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000"/>
        <meta name="msapplication-TileColor" content="#2b5797"/>
        <meta name="theme-color" content="#ffffff"/>
      </Head>
      <main className={`${raleway.variable} font-sans`}>
        <Component {...pageProps} />
      </main>
      <Script src="https://buttons.github.io/buttons.js" />
    </>
  )
}
