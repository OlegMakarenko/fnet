import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import ButtonCopy from './ButtonCopy';
import styles from '@/styles/components/ExpandableText.module.scss';

const ExpandableText = ({ children, className }) => {
	const { t } = useTranslation();
	const [isExpanded, setIsExpanded] = useState(false);

	const expand = () => setIsExpanded(true);
	const truncate = (str, threshold, n) => (str.length > threshold) ? str.slice(0, n - 1) + '...' : str;

	const text = isExpanded ? children : truncate(children || '', 200, 50);

	useEffect(() => {
		setIsExpanded(false);
	}, [children]);

	return (
		<div className={`${styles.expandableText} ${className}`} onClick={expand}>
			<ButtonCopy value={children} className={styles.copy} />
			{text}
			{!isExpanded && <div className={styles.button}>{t('button_expand')}</div>}
		</div>
	)
}

export default ExpandableText;
