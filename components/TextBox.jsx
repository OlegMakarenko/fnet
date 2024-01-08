import { useEffect, useRef } from 'react';
import CustomImage from './CustomImage';
import styles from '@/styles/components/TextBox.module.scss';

const TextBox = ({ iconSrc, placeholder, value, className, isMultiline, isLarge, errorMessage, onChange }) => {
	const textAreaRef = useRef(null);
	const isError = !!errorMessage;

	// useEffect(() => {
	// 	if (textAreaRef.current) {
	// 		textAreaRef.current.style.height = '0px';
	// 		const scrollHeight = textAreaRef.current.scrollHeight;
	// 		textAreaRef.current.style.height = scrollHeight + 'px';
	// 	}
	// }, [textAreaRef, value]);

	return (
		<div className={`${styles.textBox} ${isError && styles.textBox__error} ${className}`}>
			{!!iconSrc && <CustomImage src={iconSrc} className={styles.icon} alt="Text box icon" />}
			{!isMultiline && <input
				placeholder={placeholder}
				value={value || ''}
				onChange={e => onChange(e.target.value)}
				className={styles.input}
			/>}
			{isMultiline && <textarea
				ref={textAreaRef}
				placeholder={placeholder}
				value={value || ''}
				onChange={e => onChange(e.target.value)}
				className={`${styles.textArea} ${isLarge && styles.largeText}`}
			/>}
			{isError && <div className={styles.errorMessage}>{errorMessage}</div>}
		</div>
	);
};

export default TextBox;
