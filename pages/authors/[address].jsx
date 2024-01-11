import { fetchAuthorInfo, fetchAccountPostPage, fetchAccountPublicKey, fetchPostActivity, fetchPostHistory, fetchPostInfo } from '@/api/index';
import styles from '@/styles/pages/AuthorAccount.module.scss';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Post from '@/components/Post';
import LayoutPost from '@/components/LayoutPost';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useDataManager, usePagination, useStorage, useToggle } from '@/utils';
import { FormEditPost } from '@/components/FormEditPost';
import { useCallback, useEffect, useState } from 'react';
import { FormLikePost } from '@/components/FormLikePost';
import { FormCommentPost } from '@/components/FormCommentPost';
import Comment from '@/components/Comment';
import Header from '@/components/Header';
import { STORAGE_KEY } from '@/constants';
import { FormShare } from '@/components/FormShare';
import { FormDonate } from '@/components/FormDonate';
import Avatar from '@/components/Avatar';
import PageLoader from '@/components/PageLoader';
import PostPreview from '@/components/PostPreview';
import Profile from '@/components/Profile';

export const getServerSideProps = async ({ locale, params }) => {
	const { address } = params;

	const info = await fetchAuthorInfo(address);
	const publicKey = await fetchAccountPublicKey(address);
	const author = { address, publicKey, ...info };

	if (!author) {
		return {
			notFound: true
		};
	}

	return {
		props: {
			author,
			...(await serverSideTranslations(locale, ['common']))
		}
	};
};

const AuthorAccount = ({ author  }) => {
	const { t } = useTranslation();
	const authorName = author.name || t('label_anonymousAuthor');
	const postPagination = usePagination((searchCriteria) => fetchAccountPostPage(searchCriteria, author), [], {}, 'address');

	useEffect(() => {
		postPagination.requestFirstPage();
	}, []);

	return (
		<div className={styles.wrapper}>
			<Head>
				<title>{t('page_author', { name: authorName })}</title>
				<link rel="/preview.png" href="image url" />
				<meta property="og:description" content={authorName} />
			</Head>
			<Header />
			<LayoutPost>
				<div className="layout-flex-col">
					<Profile address={author.address} name={authorName} bio={author.bio} />
					<br />
					{postPagination.data.map((post, index) => (
						<Card>
							<PostPreview
								address={post.address}
								author={author}
								title={post.title}
								text={post.text}
								dateCreation={post.timestamp}
								key={index}
							/>
						</Card>
					))}
					<PageLoader pagination={postPagination} />
				</div>
			</LayoutPost>
		</div>
	);
};

export default AuthorAccount;
