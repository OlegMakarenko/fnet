import styles from '@/styles/components/PageLoadingIndicator.module.scss';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const PageLoadingIndicator = () => {
	const [isPageLoading, setIsPageLoading] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const handleStart = () => setIsPageLoading(true);
		const handleComplete = () => setIsPageLoading(false);

		router.events.on('routeChangeStart', handleStart);
		router.events.on('routeChangeComplete', handleComplete);
		router.events.on('routeChangeError', handleComplete);

		return () => {
			router.events.off('routeChangeStart', handleStart);
			router.events.off('routeChangeComplete', handleComplete);
			router.events.off('routeChangeError', handleComplete);
		};
	});

	return isPageLoading ? (
		<div className={styles.pageLoadingIndicator}>
			<svg className={styles.logo} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
				<ellipse cx="50" cy="50" rx="50" ry="50" fill="#000000"/>
			</svg>
		</div>
	) : null;
};

export default PageLoadingIndicator;
