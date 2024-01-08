import CustomImage from './CustomImage';
import styles from '@/styles/components/Avatar.module.scss';
import makeBlockie from 'ethereum-blockies-base64';
import { useEffect, useState } from 'react';

const AccountAvatar = ({ address }) => {
	const [image, setImage] = useState('');

	useEffect(() => {
		const image = makeBlockie(address);

		setImage(image);
	}, [address]);

	return (
		<div className={styles.accountImageContainer}>
			{!!image && <img src={image} className={styles.accountIdenticon} style={image.style} />}
			<CustomImage className={styles.accountIcon} src="/images/icon-account.svg" alt="Account" />
		</div>
	);
};

const Avatar = ({ size, value, dot }) => {
	const sizeStyleMap = {
		sm: styles.containerSm,
		md: styles.containerMd,
		lg: styles.containerLg,
		xl: styles.containerXl
	};
	const dotStyleMap = {
		red: styles.dotRed,
		green: styles.dotGreen
	};

	return (
		<div className={`${styles.container} ${sizeStyleMap[size]}`}>
			<AccountAvatar address={value || '000'} />
			{!!dot && <div className={dotStyleMap[dot]} />}
		</div>
	);
};

export default Avatar;
