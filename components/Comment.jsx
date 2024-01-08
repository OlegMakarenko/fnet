import Avatar from './Avatar';
import ValueAge from './ValueAge';
import styles from '@/styles/components/Comment.module.scss';
import { useTranslation } from 'next-i18next';

const Comment = ({ authorAddress, text, timestamp }) => {
	const { t } = useTranslation();
	const isUnconfirmed = !timestamp;

	return (
		<div className={`${styles.post} ${isUnconfirmed && styles.post__unconfirmed}`}>
			<div className={styles.header}>
				<Avatar value={authorAddress} size="md" />
				<div className={styles.headerInfo}>
					{isUnconfirmed && <div className={styles.date}>
						Processing...
					</div>}
					{!isUnconfirmed && <div className={styles.date}>
						<ValueAge value={timestamp} />
					</div>}
					{text}
				</div>
			</div>

			{/* <div className={styles.date}>
				<ValueAge value={timestamp} />
			</div> */}
		</div>
	);
};

export default Comment;
