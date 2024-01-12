import Link from 'next/link';
import Avatar from './Avatar';
import ValueAge from './ValueAge';
import styles from '@/styles/components/Comment.module.scss';
import { useTranslation } from 'next-i18next';
import { createPageHref } from 'utils/client';

const Comment = ({ author, text, timestamp }) => {
	const { t } = useTranslation();
	const authorName = author?.name || t('label_anonymousAuthor');
	const isUnconfirmed = !timestamp;

	return (
		<div className={`${styles.comment} ${isUnconfirmed && styles.comment__unconfirmed}`}>
			<Avatar value={author?.address} size="md" />
			<div className={styles.container}>
				<div className={styles.header}>
					{!!author && <Link href={createPageHref('authors', author.address)} className={styles.author}>{authorName}</Link>}
					{isUnconfirmed && <div className={styles.date}>
						Processing...
					</div>}
					{!isUnconfirmed && <div className={styles.date}>
						<ValueAge value={timestamp} />
					</div>}
				</div>
				{text}
			</div>
		</div>
	);
};

export default Comment;
