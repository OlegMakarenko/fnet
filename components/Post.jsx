import Markdown from 'react-markdown'
import Link from 'next/link';
import Avatar from './Avatar';
import Card from './Card';
import CustomImage from './CustomImage';
import ValueAge from './ValueAge';
import styles from '@/styles/components/Post.module.scss';
import { useState } from 'react';
import { createPageHref } from 'utils/client';
import { useTranslation } from 'next-i18next';
import Field from './Field';
import { numberToShortString } from 'utils/format';
import Button from './Button';
import LoadingIndicator from './LoadingIndicator';

const Post = ({
	author,
	title,
	text,
	dateCreation,
	dateEdition,
	isEditable,
	isLoading,
	likeCount,
	commentCount,
	onLikeClick,
	onCommentClick,
	onEditClick
}) => {
	const { t } = useTranslation();
	const authorName = author.name || t('label_anonymousAuthor');
	const isEdited = !!dateEdition;

	return (
		<div className={`${styles.post} ${isLoading && styles.post__loading}`}>
			{!!title && <div className={styles.title}>{title}</div>}
			<div className={styles.header}>
				<div className={styles.avatarAndInfo}>
				<Avatar value={author.address} size="md" />
					<div className={styles.headerInfo}>
						<div href={createPageHref('account', author.address)} className={styles.author}>{authorName}</div>
						{!dateCreation && <div className={styles.date}>
							Processing...
						</div>}
						{!!dateCreation && <div className={styles.date}>
							<ValueAge value={dateCreation} />
							{isEdited && (
								<span> - edited <ValueAge value={dateEdition} /></span>
							)}
						</div>}
					</div>
				</div>
				<div className={styles.statsContainer}>
					<div className={styles.likesCounter} onClick={onLikeClick}>
						<CustomImage className={styles.counterIcon} src="/images/icon-likes.svg" />
						{numberToShortString(likeCount)}
					</div>
					<div className={styles.commentCounter} onClick={onCommentClick}>
						<CustomImage className={styles.counterIcon} src="/images/icon-comments-2.svg" />
						{numberToShortString(commentCount)}
					</div>
				</div>
			</div>
			{isEditable && <Button onClick={onEditClick} className={styles.buttonEdit}>Edit Post</Button>}
			<Markdown className={styles.text}>
				{text}
			</Markdown>
			{isLoading && <LoadingIndicator className={styles.loadingIndicator} />}
		</div>
	);
};

export default Post;
