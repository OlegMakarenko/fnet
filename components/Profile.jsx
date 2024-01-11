import styles from '@/styles/components/Profile.module.scss';
import Avatar from './Avatar';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { createPageHref } from 'utils/client';

const Profile = ({ className, address, name, bio }) => {
	const { t } = useTranslation();
	const displayedName = name || t('label_anonymousAuthor');

	return (
		<div className={`${styles.profile} ${className}`}>
			<Avatar value={address} size="xl" />
			<div className={styles.profileInfo}>
				<Link href={createPageHref('authors', address)} className={styles.name}>{displayedName}</Link>
				<div className={styles.address}>ID: {address}</div>
				<div className={styles.bio}>{bio}</div>
			</div>
		</div>
	);
};

export default Profile;
