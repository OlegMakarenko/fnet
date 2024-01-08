import styles from '@/styles/components/LayoutPost.module.scss';

const LayoutPost = ({ children, leftPanelComponent, rightPanelComponent }) => {
	return (
		<div className={styles.layout}>
			<div className={styles.sidePanel}>
				{leftPanelComponent}
			</div>
			<div className={styles.content}>
				{children}
			</div>
			<div className={styles.sidePanel}>
				{rightPanelComponent}
			</div>
		</div>
	);
};

export default LayoutPost;
