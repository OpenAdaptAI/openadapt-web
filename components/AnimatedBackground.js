import dynamic from 'next/dynamic'

import styles from './AnimatedBackground.module.css'

// Import the Sketch component dynamically and set ssr to false
const SketchNoSSR = dynamic(() => import('./Sketch'), {
    ssr: false,
})

export default function AnimatedBackground() {
    return (
        <>
            <div className={styles.sketchContainer}>
                <SketchNoSSR />
            </div>
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute z-10 object-cover w-full h-full opacity-50"
            >
                <source src="./hero.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </>
    )
}
