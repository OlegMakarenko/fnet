import Markdown from 'react-markdown'
import Avatar from './Avatar';
import CustomImage from './CustomImage';
import ValueAge from './ValueAge';
import { createPageHref } from 'utils/client';
import { useTranslation } from 'next-i18next';
import { numberToShortString } from 'utils/format';
import Button from './Button';
import LoadingIndicator from './LoadingIndicator';
import { isMobile } from 'react-device-detect';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus as highlightStyles } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import styles from '@/styles/components/Post.module.scss';
import Link from 'next/link';

const Post = ({
	author,
	title,
	text,
	dateCreation,
	dateEdition,
	isLoading,
	likeCount,
	commentCount,
	onLikeClick,
	onCommentClick,
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
						<Link href={createPageHref('authors', author.address)} className={styles.author}>{authorName}</Link>
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
			<Markdown
				className={styles.text}
				components={{
					code(props) {
						const { children, className, node, ...rest } = props
						const match = /language-(\w+)/.exec(className || '')
						return match ? (
							<SyntaxHighlighter
								{...rest}
								PreTag="div"
								children={String(children).replace(/\n$/, '')}
								language={match[1]}
								style={highlightStyles}
								wrapLongLines={!isMobile}
							/>
						) : (
							<code {...rest} className={className}>
								{children}
							</code>
						)
					}
				}}
			>
				{text}
			</Markdown>
			{isLoading && <LoadingIndicator className={styles.loadingIndicator} />}
		</div>
	);
};

export default Post;
