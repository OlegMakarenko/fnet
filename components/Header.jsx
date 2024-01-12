import styles from '@/styles/components/Header.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { createPageHref, useStorage, useToggle } from '@/utils';
import { STORAGE_KEY } from '@/constants';
import Button from './Button';
import { FormCreatePost } from './FormCreatePost';
import Link from 'next/link';

const Header = () => {
	const router = useRouter();
	const { t } = useTranslation();
	const [userAddress] = useStorage(STORAGE_KEY.USER_ADDRESS, null);
	const [isCreatePostOpen, toggleCreatePost] = useToggle(false);
	const settingsButtonText = !!userAddress ? 'Settings' : 'Add Account';

	return (
		<header className={styles.header}>
			<Link className={styles.headerLogo} href={createPageHref('home')}>
				<Image src="/images/logo.svg" fill alt="Logo" />
			</Link>
			<div className={styles.headerRightSection}>
				{!!userAddress && <Button onClick={toggleCreatePost}>Create New Post</Button>}
				<Link href={createPageHref('settings')}>
					<Button>{settingsButtonText}</Button>
				</Link>
			</div>
			<FormCreatePost isVisible={isCreatePostOpen} onClose={toggleCreatePost} />
		</header>
	);
};

export default Header;
