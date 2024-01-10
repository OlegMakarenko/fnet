import styles from '@/styles/pages/Settings.module.scss';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import LayoutPost from '@/components/LayoutPost';
import Card from '@/components/Card';
import Field from '@/components/Field';
import { isSymbolAddress, useDataManager, useStorage, useToggle } from '@/utils';
import { SENDING_OPTIONS, STORAGE_KEY } from '@/constants';
import ValueAccount from '@/components/ValueAccount';
import { fetchAccountName, fetchAccountPublicKey } from '@/api/index';
import { useEffect, useState } from 'react';
import TextBox from '@/components/TextBox';
import Button from '@/components/Button';
import RadioButton from '@/components/RadioButton';
import { Dropdown } from '@/components/Dropdown';
import Avatar from '@/components/Avatar';
import ButtonPlain from '@/components/ButtonPlain';
import Alert from '@/components/Alert';
import { FormAccountName } from '@/components/FormAccountName';
import config from '@/config';
import { FormAccountActivation } from '@/components/FormAccountActivation';
import ButtonClose from '@/components/ButtonClose';
import { useRouter } from 'next/router';

export const getServerSideProps = async ({ locale }) => {
	return {
		props: {
			...(await serverSideTranslations(locale, ['common']))
		}
	};
};

const Settings = () => {
	const { t } = useTranslation();
	const router = useRouter()
	const [userLanguage, setUserLanguage] = useStorage(STORAGE_KEY.USER_LANGUAGE, 'en');
	const [userCurrency, setUserCurrency] = useStorage(STORAGE_KEY.USER_CURRENCY, 'USD');
	const [userAddress, setUserAddress] = useStorage(STORAGE_KEY.USER_ADDRESS, null);
	const [sendingOption, setSendingOption] = useStorage(STORAGE_KEY.SENDING_OPTION, null);
	const [isAccountNameOpen, toggleAccountName] = useToggle(false);
	const [isAccountActivationOpen, toggleAccountActivation] = useToggle(false);

	const isAddressValid = userAddress && isSymbolAddress(userAddress);
	const addressErrorMessage = !isAddressValid && 'Valid Symbol Address Required';

	const [fetchDisplayedName, isNameLoading, name] = useDataManager((address) => fetchAccountName(address), '...');
	const [fetchPublicKey, isKeyLoading, publicKey] = useDataManager((address) => fetchAccountPublicKey(address), null);

	const displayedName = (isAddressValid && name ) ? name : t('label_anonymousAuthor');
	const isAccountNeedsActivation = !isKeyLoading && isAddressValid && !publicKey;

	const languages = [
		{
			value: 'en',
			label: 'English'
		}
	];

	useEffect(() => {
		if (isAddressValid) {
			fetchDisplayedName(userAddress);
			fetchPublicKey(userAddress);
		}
	}, [userAddress, isAddressValid])

	return (
		<div className={styles.wrapper}>
			<Head>
				<title>{t('page_settings')}</title>
			</Head>
			<LayoutPost>
				<Card>
					<div className="layout-flex-col-fields">
						<div className={styles.header}>
							<Avatar value={userAddress} size="lg" />
							<div className={styles.headerInfo}>
								<div className={styles.name}>{displayedName}</div>
								<ButtonPlain isDisabled={!isAddressValid} onClick={toggleAccountName}>Edit Name</ButtonPlain>
							</div>
						</div>
						<Field title="Your Symbol Address">
							<TextBox value={userAddress} onChange={(text) => setUserAddress(text.toUpperCase().trim())} errorMessage={addressErrorMessage} />
						</Field>
						{isAccountNeedsActivation && <Button onClick={toggleAccountActivation}>Activate Account</Button>}
						<hr />
						<h4>Sending Method</h4>
						{!sendingOption && <Alert
							type="warning"
							title="Sending Method needs to be specified"
							text="You should select one of the sending method below, to be able to create new posts, comment or like."
						/>}
						<div className="layout-flex-col-fields">
							<RadioButton
								value={sendingOption === SENDING_OPTIONS.TRANSACTION_URI}
								onChange={() => setSendingOption(SENDING_OPTIONS.TRANSACTION_URI)}
							>
								Open transaction in the wallet app which supports the transaction URI (web+symbol://). For example:
									<li>Symbol Mobile Wallet (beta):</li>
								<div className={styles.storeLinkContainer}>
									<a target="_blank" href={config.SYMBOL_WALLET_ANDROID_URL}>
										<img className={styles.playStore} alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png'/>
									</a>
									<a target="_blank" href={config.SYMBOL_WALLET_IOS_URL}>
										<img className={styles.appStore} alt='Get it on App Store' src='/images/app-store.svg'/>
									</a>
								</div>
							</RadioButton>
							<RadioButton
								value={sendingOption === SENDING_OPTIONS.SSS}
								onChange={() => setSendingOption(SENDING_OPTIONS.SSS)}
							>
								Open transaction in the SSS Wallet browser extension.
								<div className={styles.storeLinkContainer}>
									<a target="_blank" href={config.SSS_WALLET_CHROME_URL}>
										<img className={styles.playStore} alt='Get it on Chrome Web Store' src='/images/store-chrome-web.png'/>
									</a>
								</div>
								<a href=""></a>
							</RadioButton>
							<RadioButton
								value={sendingOption === SENDING_OPTIONS.PRINT_PAYLOAD}
								onChange={() => setSendingOption(SENDING_OPTIONS.PRINT_PAYLOAD)}
							>
								Output transaction payload. The payload needs to be signed by your account and announced to the Symbol Network.
							</RadioButton>
							<RadioButton
								value={sendingOption === SENDING_OPTIONS.PRINT_FIELDS}
								onChange={() => setSendingOption(SENDING_OPTIONS.PRINT_FIELDS)}
							>
								Output transaction info. You need to create transaction and announce it using the wallet, CLI or API.
							</RadioButton>
						</div>
						<hr />
						<h4>Interface</h4>
						<Field title="Language">
							<Dropdown options={languages} value={userLanguage} onChange={setUserLanguage} />
						</Field>
					</div>
					<ButtonClose className={styles.buttonClose} onClick={() => router.back()} />
				</Card>
			</LayoutPost>
			<FormAccountName
				isVisible={isAccountNameOpen}
				onClose={toggleAccountName}
				accountAddress={userAddress}
				currentName={name}
			/>
			<FormAccountActivation
				isVisible={isAccountActivationOpen}
				onClose={toggleAccountActivation}
				accountAddress={userAddress}
				currentName={name}
			/>
		</div>
	);
};

export default Settings;
