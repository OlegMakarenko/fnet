
import { useRouter } from 'next/router';
import Modal from './Modal';
import { EmailIcon, EmailShareButton, FacebookIcon, FacebookShareButton, FacebookShareCount, LinkedinIcon, LinkedinShareButton, TelegramIcon, TelegramShareButton, TwitterIcon, TwitterShareButton, XIcon } from 'react-share';
import styles from '@/styles/components/FormShare.module.scss';
import ValueCopy from './ValueCopy';
import { useEffect, useState } from 'react';

const buttonBgStyle = { fill:'#b3a8d0' };
const buttonSize = 32;

export const FormShare = ({ isVisible, onClose, title}) => {
	const { asPath } = useRouter();
	const [url, setUrl] = useState('')

	useEffect(() => {
		if (window) {
			setUrl(`${window.location.origin}${asPath}`);
		}
	}, [isVisible])

	return (
		<Modal isVisible={isVisible} onClose={onClose}>
			<div className="layout-flex-col">
				<h4>Share</h4>
				<ValueCopy value={url} />
				<div className={styles.buttonRow}>
					<FacebookShareButton url={url}>
						<FacebookIcon size={buttonSize} round={true} bgStyle={buttonBgStyle} />
					</FacebookShareButton>
					<TwitterShareButton url={url} title={title}>
						<XIcon size={buttonSize} round={true} bgStyle={buttonBgStyle} />
					</TwitterShareButton>
					<TelegramShareButton url={url} title={title}>
						<TelegramIcon size={buttonSize} round={true} bgStyle={buttonBgStyle} />
					</TelegramShareButton>
					<LinkedinShareButton url={url} title={title}>
						<LinkedinIcon size={buttonSize} round={true} bgStyle={buttonBgStyle} />
					</LinkedinShareButton>
					<EmailShareButton url={url} subject={title}>
						<EmailIcon size={buttonSize} round={true} bgStyle={buttonBgStyle} />
					</EmailShareButton>
				</div>
			</div>
		</Modal>
	);
};
