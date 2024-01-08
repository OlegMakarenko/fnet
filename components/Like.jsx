import Link from 'next/link';
import Avatar from './Avatar';
import ValueAge from './ValueAge';
import styles from '@/styles/components/Post.module.scss';
import { createPageHref } from 'utils/client';
import { useTranslation } from 'next-i18next';

const Like = ({ authorAddress, reaction, timestamp }) => {
	const { t } = useTranslation();
	const authorName = t('label_anonymousAuthor');

	return (
		<div className={styles.post}>
			<div className={styles.header}>
				<Avatar value={authorAddress} size="md" />
				<div className={styles.headerInfo}>
					<Link href={createPageHref('account', authorAddress)} className={styles.author}>{authorName}</Link>
					<div className={styles.date}>
						<ValueAge value={timestamp} />
					</div>
				</div>
			</div>
			<h2>{reaction}</h2>
		</div>
	);
};

export default Like;
