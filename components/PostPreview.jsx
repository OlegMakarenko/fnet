import Avatar from './Avatar';
import ValueAge from './ValueAge';
import { createPageHref } from 'utils/client';
import { useTranslation } from 'next-i18next';
import styles from '@/styles/components/Post.module.scss';
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
	const authorName = author.name || t('label_anonymousAuthor');
	const imageUrl = text.match(/!\[.*?\]\((.*?)\)/)?.[1];

	return (
		<Link className={`${styles.post} ${isLoading && styles.post__loading}`} href={createPageHref('posts', address)}>
			<div className={styles.header}>
				<div className={styles.avatarAndInfo}>
					<Avatar value={author.address} size="md" />
					<div className={styles.headerInfo}>
						<div href={createPageHref('authors', author.address)} className={styles.author}>{authorName}</div>
						{!dateCreation && <div className={styles.date}>
							Processing...
						</div>}
						{!!dateCreation && <div className={styles.date}>
							<ValueAge value={dateCreation} />
						</div>}
					</div>
				</div>
			</div>
			{/* {!!title && <div className={styles.title}>{title}</div>} */}
			<div className={styles.text}>
				<div className={styles.title}>{title}</div>
				{!!imageUrl && <img src={imageUrl} />}
			</div>
		</Link>
	);
};

export default PostPreview;
