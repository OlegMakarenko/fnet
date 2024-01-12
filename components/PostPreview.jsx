import Avatar from './Avatar';
import ValueAge from './ValueAge';
import { createPageHref } from 'utils/client';
import { useTranslation } from 'next-i18next';
import styles from '@/styles/components/PostPreview.module.scss';
import Link from 'next/link';

const PostPreview = ({
	address,
	author,
	title,
	text,
	dateCreation,
	isLoading,
}) => {
	const { t } = useTranslation();
	const authorName = author?.name || t('label_anonymousAuthor');
	//const imageUrl = text.match(/!\[.*?\]\((.*?)\)/)?.[1];

	return (
		<Link className={`${styles.postPreview} ${isLoading && styles.post__loading}`} href={createPageHref('posts', address)}>
			<div className={styles.header}>
				<div className={styles.avatarAndInfo}>
					<div className={styles.headerInfo}>
						{!!author && <Link href={createPageHref('authors', author.address)} className={styles.author}>{authorName}</Link>}
						{!dateCreation && <div className={styles.date}>
							Processing...
						</div>}
						{!!dateCreation && <div className={styles.date}>
							<ValueAge value={dateCreation} />
						</div>}
					</div>
				</div>
			</div>
			<div className={styles.title}>{title || 'Post without title...'}</div>
		</Link>
	);
};

export default PostPreview;
