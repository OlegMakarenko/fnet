import { fetchAccountName, fetchPostActivity, fetchPostHistory, fetchPostInfo } from '@/api/index';
import styles from '@/styles/pages/PostAccount.module.scss';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Post from '@/components/Post';
import LayoutPost from '@/components/LayoutPost';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useDataManager, useStorage, useToggle } from '@/utils';
import { FormEditPost } from '@/components/FormEditPost';
import { useCallback, useEffect, useState } from 'react';
import { FormLikePost } from '@/components/FormLikePost';
import { FormCommentPost } from '@/components/FormCommentPost';
import Comment from '@/components/Comment';
import Header from '@/components/Header';
import { STORAGE_KEY } from '@/constants';
import { FormShare } from '@/components/FormShare';
import { FormDonate } from '@/components/FormDonate';

export const getServerSideProps = async ({ locale, params }) => {
	const { address } = params;

	const data = await fetchPostInfo(address);

	if (!data) {
		return {
			notFound: true
		};
	}

	const name = await fetchAccountName(data.author.address);

	return {
		props: {
			author: {
				...data.author,
				name
			},
			initialPost: data.post,
			postAccount: data.postAccount,
			...(await serverSideTranslations(locale, ['common']))
		}
	};
};

const PostAccount = ({ author, initialPost, postAccount }) => {
	const { t } = useTranslation();
	const [userAddress] = useStorage(STORAGE_KEY.USER_ADDRESS, null);
	const [isEditPostOpen, toggleEditPost] = useToggle(false);
	const [isLikePostOpen, toggleLikePost] = useToggle(false);
	const [isCommentPostOpen, toggleCommentPost] = useToggle(false);
	const [isShareOpen, toggleShare] = useToggle(false);
	const [isDonateOpen, toggleDonate] = useToggle(false);
	const [likeCount, setLikeCount] = useState(0);
	const [commentCount, setCommentCount] = useState(0);
	const [editionDate, setEditionDate] = useState(null);
	const creationDate = initialPost.timestamp;
	const isPostEditable = author.address === userAddress;

	const [fetchHistory, isHistoryLoading, history] = useDataManager(() => fetchPostHistory(postAccount.address, author), [], console.error);
	const [fetchActivity, isActivityLoading, activity] = useDataManager(() => fetchPostActivity(postAccount.address), {}, console.error);
	const post = history[0] || initialPost;

	const scrollToComments = useCallback(() => {
		const yOffset = -100;
		const element = document.getElementById('comments');
		const y = element.getBoundingClientRect().top + window.scrollY + yOffset;

		window.scrollTo({top: y, behavior: 'smooth'});
	}, []);

	useEffect(() => {
		fetchHistory();
		fetchActivity();
	}, []);

	useEffect(() => {
		if (history.length > 1) {
			setEditionDate(history[0].timestamp)
		}
		if (activity?.likes) {
			setLikeCount(activity.likes.length)
		}
		if (activity?.comments) {
			setCommentCount(activity.comments.length)
		}
	}, [history, activity]);

	return (
		<div className={styles.wrapper}>
			<Head>
				<title>{t('page_post', {title: post.title})}</title>
				<link rel="/preview.png" href="image url" />
				<meta property="og:description" content={post.title} />
			</Head>
			<Header />
			<LayoutPost>
				<div className="layout-flex-col">
					<Card>
						<div className="layout-flex-col">
							<Post
								author={author}
								title={post.title}
								text={post.text}
								dateCreation={creationDate}
								dateEdition={editionDate}
								isEditable={isPostEditable}
								isLoading={isHistoryLoading || isActivityLoading}
								likeCount={likeCount}
								commentCount={commentCount}
								onLikeClick={toggleLikePost}
								onCommentClick={scrollToComments}
								onEditClick={toggleEditPost}
							/>
							<div className={styles.actionPanel}>
								<Button onClick={toggleCommentPost} icon="/images/button/comment.svg">{t('button_comment')}</Button>
								<Button onClick={toggleLikePost} icon="/images/button/like.svg">{t('button_like')}</Button>
								<Button icon="/images/button/share.svg" onClick={toggleShare}>{t('button_share')}</Button>
								<Button icon="/images/button/xym.svg" onClick={toggleDonate}>{t('button_donate')}</Button>
							</div>
						</div>
					</Card>

					<Card>
						<div className="layout-flex-col" id="comments">
							<h4>Comments</h4>
							<div>
								{activity?.comments?.map((comment, index) => (
									<Comment
										authorAddress={comment.authorAddress}
										text={comment.text}
										timestamp={comment.timestamp}
										key={index}
									/>
								))}
							</div>
						</div>
					</Card>

					{/* {history?.map((post, index) => (
						<Card>
							<Post
								author={author}
								title={post.title}
								text={post.text}
								dateCreation={post.timestamp}
								key={index}
							/>
						</Card>
					))} */}
				</div>
				<FormEditPost isVisible={isEditPostOpen} onClose={toggleEditPost} post={post} postAccount={postAccount} author={author} />
				<FormLikePost isVisible={isLikePostOpen} onClose={toggleLikePost} postAccount={postAccount} />
				<FormCommentPost isVisible={isCommentPostOpen} onClose={toggleCommentPost} postAccount={postAccount} />
				<FormShare isVisible={isShareOpen} onClose={toggleShare} title={post.title} />
				<FormDonate isVisible={isDonateOpen} onClose={toggleDonate} author={author} />
			</LayoutPost>
		</div>
	);
};

export default PostAccount;
