import styles from '@/styles/pages/Home.module.scss';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getServerSideProps = async ({ locale }) => {
	// const [blocksPage, latestTransactionsPage, pendingTransactionsPage] = await Promise.all([
	// 	fetchBlockPage({ pageSize: 50 }),
	// 	fetchTransactionPage({ pageSize: 5 }),
	// 	fetchTransactionPage({ pageSize: 5, group: 'unconfirmed' })
	// ]);
	// const [marketDataPromise, transactionStatsPromise, nodeStatsPromise, transactionChartPromise, blockStatsPromise] =
	// 	await Promise.allSettled([
	// 		fetchMarketData(),
	// 		fetchTransactionStats(),
	// 		fetchNodeStats(),
	// 		fetchTransactionChart({ isPerDay: true }),
	// 		fetchBlockStats()
	// 	]);

	return {
		props: {

			...(await serverSideTranslations(locale, ['common']))
		}
	};
};

const Home = ({

}) => {
	const { t } = useTranslation();

	return (
		<div className={styles.wrapper}>
			<Head>
				<title>Home</title>
			</Head>
		</div>
	);
};

export default Home;
