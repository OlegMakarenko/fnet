import { fetchAccountImagePage, fetchAccountPublicKey, fetchAuthorInfo } from '@/api/index';
import styles from '@/styles/pages/AuthorAccount.module.scss';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import LayoutPost from '@/components/LayoutPost';
import { fileToBase64, useAuthorInfo, usePagination } from '@/utils';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import PageLoader from '@/components/PageLoader';
import ButtonAttachFile from '@/components/ButtonAttachFile';
import { FormTransaction } from '@/components/FormTransaction';
import { MAX_IMAGE_SIZE_KB, MESSAGE_TYPES } from '@/constants';
import imageCompression from 'browser-image-compression';
import Card from '@/components/Card';
import GalleryImage from '@/components/GalleryImage';
import Alert from '@/components/Alert';

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

const Home = ({ author  }) => {
	const { t } = useTranslation();
	const [isUploadedImageCompressed, setIsUploadedImageCompressed] = useState(false);
	const [uploadedImageUint8Array, setUploadedImageUint8Array] = useState(null);
	const [uploadedImage, setUploadedImage] = useState(null);
	const [uploadedImageSrc, setUploadedImageSrc] = useState('');
	const postPagination = usePagination((searchCriteria) => fetchAccountImagePage(searchCriteria, author), [], {});

	useEffect(() => {
		postPagination.requestFirstPage();
	}, []);

	// TODO: refactor image optimization
	const updateImage = async (imageFile) => {
		const options = {
			maxSizeMB: 0.09,
			maxWidthOrHeight: 750,
			useWebWorker: true,
		}
		try {
			let finalFile = imageFile;
			let isImageCompressed = false;
			if (imageFile.size / 1024 > MAX_IMAGE_SIZE_KB) {
				finalFile = await imageCompression(imageFile, options);
				isImageCompressed = true;
			}
			const imageBase64 = await fileToBase64(finalFile);
			const buffer = await finalFile.arrayBuffer();
			const uint8Array = new Uint8Array(buffer);
			setUploadedImageUint8Array(uint8Array);
			setUploadedImageSrc(imageBase64);
			setIsUploadedImageCompressed(isImageCompressed);
			console.log(`file size ${finalFile.size / 1024 / 1024} MB`);
			console.log(`buffer size ${buffer.byteLength}`);
			console.log(`uint8Array size ${uint8Array.byteLength}`);
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		if (uploadedImage)
			updateImage(uploadedImage);
	}, [uploadedImage])

	return (
		<div className={styles.wrapper}>
			<Head>
				<title>{t('page_gallery')}</title>
			</Head>
			<Header />
			<LayoutPost>
				<div className="layout-flex-col-sections">
					<h3>Gallery</h3>

					<ButtonAttachFile onFileUploaded={setUploadedImage}>Upload Image</ButtonAttachFile>

					{!!uploadedImageSrc && !!uploadedImageUint8Array && (
						<Card>
							<FormTransaction type={MESSAGE_TYPES.GALLERY_IMAGE} data={{ image: uploadedImageUint8Array }}>
								{isUploadedImageCompressed && (
									<Alert
										type="danger"
										title="File is too large!"
										text={`The image file exceeded the maximum allowed ${MAX_IMAGE_SIZE_KB} KB. We compressed it for you but the quality loss can occur. Please review the image below before sending it, or compress the image by yourself.`}
									/>
								)}
								<a style={{width: '100%', height: '50vh', objectFit: 'contain'}} href={uploadedImageSrc} target="_blank">
								<img src={uploadedImageSrc} style={{width: '100%', height: '50vh', objectFit: 'contain'}} />
								</a>
							</FormTransaction>
						</Card>
					)}

					<div className="layout-flex-row-stacked">
						{postPagination.data.map((image, index) => (
							<GalleryImage src={image.base64} hash={image.hash} author={author} timestamp={image.timestamp} key={index} />
						))}
					</div>
					<PageLoader pagination={postPagination} />
				</div>
			</LayoutPost>
		</div>
	);
};

export default Home;
