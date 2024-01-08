import styles from '@/styles/components/ButtonPlain.module.scss';
import CustomImage from './CustomImage';

const ButtonPlain = ({ className, children, isDisabled, onClick, icon }) => {
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

export default ButtonPlain;
