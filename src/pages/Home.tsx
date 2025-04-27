import styles from '../assets/styles/Home.module.scss';
import { useEffect } from 'react';
import { Button } from '../components/UI/Button';
import { Feature } from '../components/Feature';
import aiPhoto from '../assets/images/ai.webp';
import analysPhoto from '../assets/images/analys.webp';
import timePhoto from '../assets/images/time.webp';

interface IProps {
    mainRef: React.RefObject<HTMLDivElement | null>;
}

export function Home({mainRef}: IProps) {
    useEffect(() => {
        const main = mainRef.current; 
        if(!main) {
            return;
        }
        main.style.marginTop = '-100px';
        main.style.marginBottom = '-100px';

        return () => {
            main.style.cssText = '';
        }
    })
    return (
        <div className={styles.home}>
            <section className={styles.hero}>
                <div className={styles.hero__container}>
                    <h1 className={styles.hero__title}>Create and Share Polls with Ease</h1>
                    <p className={styles.hero__subtitle}>
                        Pollify helps you gather opinions, make decisions, and engage your audience
                    </p>
                    <div className={styles.hero__buttons}>
                        <Button href="/login" className={styles.hero__button}>Get Started</Button>
                        <Button href="/login" className={styles.hero__buttonSecondary}>Sign In</Button>
                    </div>
                </div>
            </section>

            <section className={styles.features}>
                <Feature 
                    title="Create Custom Polls in Minutes"
                    description="Design engaging polls with multiple question types, customizable options, and AI-powered suggestions. Perfect for businesses, educators, and event planners."
                    linkText="Try it now →"
                    linkTo="/login"
                    imageSrc={timePhoto}
                    imageAlt="Create custom polls interface"
                />

                <Feature 
                    title="Analyze Results in Real-Time"
                    description="Watch responses come in live with beautiful, interactive charts and graphs. Export data for deeper analysis or share results with your audience instantly."
                    linkText="See how it works →"
                    linkTo="/login"
                    imageSrc={analysPhoto}
                    imageAlt="Real-time poll results dashboard"
                    isReversed={true}
                />

                <Feature 
                    title="AI-Powered Poll Generation"
                    description="Let our advanced AI create professional polls for you based on your topic. Save time and get expert-level questions that drive meaningful insights."
                    linkText="Discover AI capabilities →"
                    linkTo="/login"
                    imageSrc={aiPhoto}
                    imageAlt="AI poll generation"
                />
            </section>

            <section className={styles.cta}>
                <div className={styles.cta__container}>
                    <h2 className={styles.cta__title}>Ready to start collecting insights?</h2>
                    <p className={styles.cta__description}>
                        Join thousands of users who trust Pollify for their polling needs
                    </p>
                    <Button href="/register" className={styles.cta__button}>Create Your First Poll</Button>
                </div>
            </section>
        </div>
    );
}