import { fetchAccountPostPage, fetchAuthorInfo, fetchRecentPostPage } from '@/api/index';
import styles from '@/styles/pages/AuthorAccount.module.scss';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import LayoutPost from '@/components/LayoutPost';
import { useAuthorInfo, usePagination } from '@/utils';
import { useEffect } from 'react';
import Header from '@/components/Header';
import PageLoader from '@/components/PageLoader';
import PostPreview from '@/components/PostPreview';

export const getServerSideProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale, ['common']))
		}
	};
};

const Home = () => {
	const { t } = useTranslation();
	const postPagination = usePagination((searchCriteria) => fetchRecentPostPage(searchCriteria), [], {}, 'address');
	const authorInfoMap = useAuthorInfo(postPagination.data.map(post => post.author), fetchAuthorInfo);

	useEffect(() => {
		postPagination.requestFirstPage();
	}, []);

	return (
		<div className={styles.wrapper}>
			<Head>
				<title>{t('page_home')}</title>
			</Head>
			<Header />
			<LayoutPost>
				<div className="layout-flex-col-sections">
					<h3>Recent Posts</h3>
					<div className="layout-flex-col">
						{postPagination.data.map((post, index) => (
							<PostPreview
								address={post.address}
								author={authorInfoMap[post.author.address]}
								title={post.title}
								text={post.text}
								dateCreation={post.timestamp}
								key={index}
							/>
						))}
						<PageLoader pagination={postPagination} />
					</div>
				</div>
			</LayoutPost>
		</div>
	);
};

export default Home;
