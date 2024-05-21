import { useEffect, useState } from 'react';
import { createAccountActivationTransaction, createAccountNameTransaction, createCommentTransaction, createDonationTransaction, createGalleryImageTransaction, createLikeTransaction, createPageHref, createPostTransaction, signWithSSS, useDataManager, useStorage } from '@/utils';
import { SymbolExtension } from 'symbol-wallet-lib';
import Field from './Field';
import Button from './Button';
import { MESSAGE_TYPES, SENDING_OPTIONS, STORAGE_KEY } from '@/constants';
import ExpandableText from './ExpandableText';
import ButtonPlain from './ButtonPlain';
import { announceTransaction, fetchAccountPublicKey } from '../api';
import Alert from './Alert';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import LoadingIndicator from './LoadingIndicator';
import styles from '@/styles/components/FormTransaction.module.scss';

const typesRequiredPublicKey = [
	MESSAGE_TYPES.POST,
	MESSAGE_TYPES.ACCOUNT_NAME,
	MESSAGE_TYPES.GALLERY_IMAGE
];

export const FormTransaction = ({ children, postAccount, type, data, onClose }) => {
	const { t } = useTranslation();
	const [sendingOption] = useStorage(STORAGE_KEY.SENDING_OPTION, 'init');
	const [transaction, setTransaction] = useState('');
	const [userAddress] = useStorage(STORAGE_KEY.USER_ADDRESS, null);
	const [title, setTitle] = useState('');
	const [isSent, setIsSent] = useState(false);
	const postLink = postAccount ? createPageHref('posts', postAccount.address) : null;

	const [fetchPublicKey, isKeyLoading, userPublicKey] = useDataManager((address) => fetchAccountPublicKey(address), null);

	const isKeyNeeded = typesRequiredPublicKey.some(item => item === type);
	const isKeyErrorShown = isKeyNeeded && !isKeyLoading && !userPublicKey;

	const sendWithSSS = async () => {
		if (!window.SSS) {
			toast.error(t('SSS Extension is not installed in your browser or is blocked for this site'));
			return;
		}
		try {
			const transactionPayload = await signWithSSS(transaction.sssTransaction);
			await announceTransaction(transactionPayload);
			setIsSent(true)
			toast.info('Transaction announced. Awaiting confirmation');
			if (postAccount) {
				window.location.href = createPageHref('posts', postAccount.address);
			}
			onClose();
		} catch (error) {
			toast.error(error.message);
		}
	};

	const sendWithSymbolExtension = async () => {
		const extension = new SymbolExtension();
		await extension.registerProvider();

		if (!extension.isConnected()) {
			toast.error(t('Symbol Wallet Extension is not installed in your browser or is blocked for this site'));
			return;
		}

		await extension.requestTransaction(transaction.payload);
	}

	const update = () => {
		switch (type) {
			case MESSAGE_TYPES.POST: {
				setTitle('Post');
				if (!userPublicKey) return;
				setTransaction(createPostTransaction(userPublicKey, postAccount, data.title, data.text));
				break;
			}
			case MESSAGE_TYPES.COMMENT: {
				setTitle('Comment');
				setTransaction(createCommentTransaction(postAccount, data.text));
				break;
			}
			case MESSAGE_TYPES.LIKE: {
				setTitle('Reaction');
				setTransaction(createLikeTransaction(postAccount, data.reaction));
				break;
			}
			case MESSAGE_TYPES.ACCOUNT_NAME: {
				setTitle('Edit Name');
				if (!userPublicKey || !userAddress) return;
				setTransaction(createAccountNameTransaction(
					userPublicKey,
					userAddress,
					data.currentName,
					data.name,
					data.currentBio,
					data.bio
				));
				break;
			}
			case MESSAGE_TYPES.ACCOUNT_ACTIVATION: {
				setTitle('Activate Account');
				if (!userAddress) return;
				setTransaction(createAccountActivationTransaction(userAddress));
				break;
			}
			case MESSAGE_TYPES.DONATE: {
				setTitle('Donate to Author');
				setTransaction(createDonationTransaction(data.address, data.amount));
				break;
			}
			case MESSAGE_TYPES.GALLERY_IMAGE: {
				setTitle('Upload Image');
				if (!userPublicKey) return;
				setTransaction(createGalleryImageTransaction(userPublicKey, data.image));
				break;
			}
			default: break;
		}
	}

	useEffect(() => {
		if (userAddress && typesRequiredPublicKey.some(item => item === type)) {
			fetchPublicKey(userAddress);
		}
	}, [userAddress, type]);

	useEffect(() => {
		update();
	}, [postAccount, data, userPublicKey, userAddress]);

	useEffect(() => {
		if (!sendingOption) {
			window.location.href = createPageHref('settings');
		}
	}, [sendingOption]);

	return (
		<div className={styles.form}>
			<h4>{title}</h4>
			{/* {userAddress && (
				<div className={styles.header}>
					<Avatar value={userAddress} size="md" />
					<div className={styles.headerInfo}>
						<div className={styles.name}>{' '}</div>
						<div className={styles.address}>{userAddress}</div>
					</div>
				</div>
			)} */}
			{isKeyLoading && <LoadingIndicator />}
			{isKeyErrorShown && <Alert
				type="warning"
				title="Unknown Account"
				text="Please provide your valid Symbol account address in the settings and activate it, to be able to interact with the website"
			/>}
			{!isKeyErrorShown && !isKeyLoading && <>
				{children}
				<div className={styles.buttonRow}>
					{!!postLink && (
						<a className={styles.buttonOpenPost} href={postLink}>
							{!isSent && <ButtonPlain>Open Post</ButtonPlain>}
							{isSent && <Button>Open Post</Button>}
						</a>
					)}
					{sendingOption === SENDING_OPTIONS.TRANSACTION_URI && (
						<a className={styles.buttonSend} href={transaction.uri}>
							<Button onClick={() => setIsSent(true)}>Send with Symbol Wallet</Button>
						</a>
					)}
					{sendingOption === SENDING_OPTIONS.SSS && (
						<Button onClick={sendWithSSS}>Send with SSS Wallet</Button>
					)}
					{sendingOption === SENDING_OPTIONS.SYMBOL_EXTENSION && (
						<Button onClick={sendWithSymbolExtension}>Send with Symbol Wallet</Button>
					)}
				</div>
				{sendingOption === SENDING_OPTIONS.PRINT_PAYLOAD && (
					<Field title="Transaction Payload">
						<ExpandableText onClick={() => setIsSent(true)}>{transaction.payload}</ExpandableText>
					</Field>
				)}
			</>}
		</div>
	);
};
