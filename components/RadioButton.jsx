import styles from '@/styles/components/RadioButton.module.scss';

const RadioButton = ({ className, value, onChange, children }) => {
	return (
		<div className={`${styles.radioButton} ${className}`} onClick={onChange}>
			<div className={`${styles.icon} ${!!value ? styles.icon__active : styles.icon__inactive}`} />
			<div className={`${styles.content} ${!!value ? styles.content__active : styles.content__inactive}`}>
				{children}
			</div>
		</div>
	);
};

export default RadioButton;
