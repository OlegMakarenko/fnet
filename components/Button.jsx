import styles from '@/styles/components/Button.module.scss';
import CustomImage from './CustomImage';

const Button = ({ className, children, isDisabled, isSecondary, onClick, icon }) => {
	return (
		<button
			disabled={isDisabled}
			className={`${styles.button} ${isDisabled && styles.button__disabled} ${className}`}
			onClick={!isDisabled ? onClick : undefined}
		>
			{!!icon && <CustomImage src={icon} className={styles.icon} />}
			{children}
		</button>
	);
};

export default Button;
