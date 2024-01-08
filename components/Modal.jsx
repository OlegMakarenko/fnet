import ButtonClose from './ButtonClose';
import Card from './Card';
import styles from '@/styles/components/Modal.module.scss';
import { useEffect } from 'react';

const Modal = ({ children, className, isVisible, onClick, onClose }) => {
	const handleCardClick = e => {
		e.stopPropagation();
		if (onClick) {
			onClick();
		}
	};

	useEffect(() => {
		if (isVisible) {
			document.body.classList.add('disable-scroll');
		} else {
			document.body.classList.remove('disable-scroll');
		}
	}, [isVisible]);

	return isVisible ? (
		<div className={styles.overlay}>
			<Card className={`${styles.modal} ${className}`} onClick={handleCardClick}>
				<ButtonClose onClick={onClose} className={styles.buttonClose} />
				{children}
			</Card>
		</div>
	) : null;
};

export default Modal;
