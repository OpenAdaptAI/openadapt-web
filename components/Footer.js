import Image from 'next/image';

import styles from './Footer.module.css'

export default function Footer() {
    return (
        <div className={`text-white`} style={{backgroundColor: 'rgba(0, 0, 30, 1)'}}>
            <footer className="grid grid-flow-row auto-rows-max" style={{backgroundColor: 'rgba(0, 0, 30, 1)'}}>
                <Image
                    className="invert m-auto my-6"
                    priority
                    src="/images/favicon.svg"
                    height={32}
                    width={32}
                    alt="Large Language Model"
                />
        </footer>
    </div>
    )
}
