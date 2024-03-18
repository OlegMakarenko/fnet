import Avatar from './Avatar';
import ValueAge from './ValueAge';
import { createPageHref } from 'utils/client';
import { useTranslation } from 'next-i18next';
import LoadingIndicator from './LoadingIndicator';
import styles from '@/styles/components/GalleryImage.module.scss';
import Link from 'next/link';
import Button from './Button';

const GalleryImage = ({
	author,
	timestamp,
	src,
	isLoading,
	hash
}) => {
	const { t } = useTranslation();
	const authorName = author.name || t('label_anonymousAuthor');

	return (
		<div className={`${styles.container} ${isLoading && styles.container__loading}`}>
			<a className={styles.image} href={`/api/image?hash=${hash}`} target="_blank">
				<img src={src} className={styles.image} />
			</a>
			<div className={styles.footer}>
				<div className={styles.info}>
					{/* <Avatar value={author.address} size="sm" /> */}
					{!timestamp && <div className={styles.date}>
						Processing...
					</div>}
					{!!timestamp && <div className={styles.date}>
						<ValueAge value={timestamp} />
					</div>}
				</div>
				<Button>Copy Link</Button>
			</div>
			{isLoading && <LoadingIndicator className={styles.loadingIndicator} />}
		</div>
	);
};

export default GalleryImage;
