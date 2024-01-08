import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html>
			<Head>
				<meta charset="utf-8" />
				<link rel="icon" href="/favicon.ico" />
				<link rel="icon" href="/favicon-32.png" sizes="32x32" />
				<link rel="icon" href="/favicon-144.png" sizes="144x144" />
				<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
				<meta name="format-detection" content="telephone=no" />
				<meta name="theme-color" content="#F5F9FB" />
				<meta name="description" content="FNet" />
				<meta property="og:title" content="FNet" />
				<meta property="og:image" content="/preview.png" />
				<meta property="og:image:width" content="1200" />
				<meta property="og:image:height" content="630" />
				<link rel="apple-touch-icon" href="/logo192.png" />
				<link rel="manifest" href="/manifest.json" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preload" href="/fonts/Mona-Sans.woff2" as="font" type="font/woff2" crossorigin />
				<link
					// eslint-disable-next-line max-len
					href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,200;0,300;0,400;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,600;1,700;1,800;1,900&display=swap"
					rel="stylesheet"
				/>
				<link href="https://fonts.googleapis.com/css2?family=Abhaya+Libre:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
				<link
					href="https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&display=swap"
					rel="stylesheet"
				/>
				<link
					// eslint-disable-next-line max-len
					href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
					rel="stylesheet"
				/>
				<link href="https://fonts.googleapis.com/css2?family=PT+Serif&display=swap" rel="stylesheet" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
