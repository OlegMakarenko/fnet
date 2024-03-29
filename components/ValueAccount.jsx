import Avatar from '@/components/Avatar';
import ButtonCopy from '@/components/ButtonCopy';
import { STORAGE_KEY } from '@/constants';
import styles from '@/styles/components/ValueAccount.module.scss';
import { createPageHref, trunc, useStorage } from '@/utils';
import Link from 'next/link';
import { useState } from 'react';

const ValueAccount = ({ address, name, size, raw, position, className, isNavigationDisabled, isCopyDisabled, onClick }) => {
	let containerStyle = '';
	const textStyle = size === 'md' ? styles.textMd : '';
	const displayedText = !raw && name ? `${name} (${trunc(address, 'address-short')})` : address;

	switch (position) {
		case 'left':
			containerStyle = styles.containerLeft;
			break;
		case 'right':
			containerStyle = styles.containerRight;
			break;
	}

	const handleClick = e => {
		e.stopPropagation();
		if (!onClick) return;
		if (isNavigationDisabled) e.preventDefault();
		onClick();
	};

	return (
		<div className={`${styles.valueAccount} ${containerStyle} ${className}`}>
			{!address && '-'}
			{!!address && (
				<>
					<Avatar type="account" value={address} size={size} />
					<div className={styles.addressContainer}>
						<Link className={textStyle} href={createPageHref('accounts', address)} onClick={handleClick}>
							{displayedText}
						</Link>
						{!isCopyDisabled && <ButtonCopy value={address} />}
					</div>
				</>
			)}
		</div>
	);
};

export default ValueAccount;
