import LoadingIndicator from './LoadingIndicator';
import styles from '@/styles/components/PageLoader.module.scss';
import { useTranslation } from 'next-i18next';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const PageLoader = ({ pagination }) => {
	const { t } = useTranslation('common');
	const { isLoading, isError, isLastPage, requestNextPage, data } = pagination;
	const loadingRef = useInView({ threshold: 0 });
	const refLoadingTarget = loadingRef.ref;
	const isLoadingTargetInView = loadingRef.inView;

	const handleTargetInView = () => {
		if (isLoadingTargetInView && !isLoading && !isError && !isLastPage) {
			requestNextPage();
		}
	};
	useEffect(handleTargetInView, [isLoadingTargetInView, isLoading, requestNextPage]);

	return (
		<div className={styles.root}>
			{!data.length && !isLoading && <div className={styles.emptyListMessage}>{t('message_emptyTable')}</div>}
			{!isLastPage && !isError && (
				<div className={styles.tablePageLoader}>
					<div ref={refLoadingTarget} />
					{isLoading && <LoadingIndicator />}
				</div>
			)}
			{!isLoading && isError && (
				<div className={styles.tryAgainButton} onClick={requestNextPage}>
					{t('button_tryAgain')}
				</div>
			)}
		</div>
	);
};

export default PageLoader;
