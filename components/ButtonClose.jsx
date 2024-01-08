import Image from 'next/image';
import styles from '@/styles/components/ButtonClose.module.scss';

const ButtonClose = ({ className, onClick }) => {
	return (
		<div className={`${styles.buttonClose} ${className}`} onClick={onClick}>
			<Image src="/images/icon-close.svg" fill alt="Close" />
		</div>
	);
};

export default ButtonClose;
