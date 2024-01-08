
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getServerSideProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale, ['common']))
		}
	};
};

const Posts = ({}) => {
	const { t } = useTranslation();


	return (
		<div className={styles.wrapper}>
			<Head>
				<title></title>
			</Head>
		</div>
	);
};

export default Posts;
