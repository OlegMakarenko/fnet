import styles from '@/styles/components/Alert.module.scss';

const Alert = ({ type, title, text, className, onClick }) => {
	const typeAlertMap = {
        warning: {
            icon: '/images/icon-alert-warning-white.png',
			containerStyle: `${styles.alert} ${styles.warning}`,
            titleStyle: `${styles.title} ${styles.warningText}`,
            bodyStyle: `${styles.body} ${styles.warningText}`,
        },
        danger: {
            icon: '/images/icon-alert-danger-white.png',
			containerStyle: `${styles.alert} ${styles.danger}`,
            titleStyle: `${styles.title} ${styles.dangerText}`,
            bodyStyle: `${styles.body} ${styles.dangerText}`,
        },
    };

    const alert = typeAlertMap[type];

	return (
		<div className={`${alert.containerStyle} ${className}`} onClick={onClick}>
			<img src={alert.icon} className={styles.icon} />
			<div className={alert.titleStyle}>{title}</div>
			<div className={alert.bodyStyle}>{text}</div>
		</div>
	)
};

export default Alert;
