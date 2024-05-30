import { motion } from 'framer-motion'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowPointer } from '@fortawesome/free-solid-svg-icons'

export default function AnimatedLogo() {
    return (
        <div className="flex items-center justify-center z-10">
            <motion.div
                animate={{ y: [-3, 3, -3] }}
                transition={{
                    duration: 2,
                    ease: 'easeInOut',
                    times: [0, 0.5, 1],
                    repeat: Infinity,
                    repeatDelay: 0,
                }}
            >
                <motion.div
                    animate={{ x: [-1.5, 1.5, -1.5] }}
                    transition={{
                        duration: 1.5,
                        ease: 'easeInOut',
                        times: [0, 0.5, 1],
                        repeat: Infinity,
                        repeatDelay: 0,
                    }}
                    style={{ zIndex: 10 }}
                >
                    <Image
                        className="invert relative left-8"
                        priority
                        src="/images/favicon.svg"
                        height={64}
                        width={64}
                        alt="Large Language Model"
                    />
                </motion.div>
                <FontAwesomeIcon
                    icon={faArrowPointer}
                    className="text-6xl relative bottom-4"
                />
            </motion.div>
        </div>
    )
}
