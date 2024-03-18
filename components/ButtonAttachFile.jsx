import { useRef } from 'react';
import Button from './Button';

const ButtonAttachFile = ({ className, children, isDisabled, isPrimary, onFileUploaded, icon }) => {
	const hiddenFileInput = useRef(null);

	const handleClick = () => {
		hiddenFileInput.current.click();
	};

	const handleChange = (event) => {
		const fileUploaded = event.target.files[0];
		onFileUploaded(fileUploaded);
	};

	return (
		<>
			<Button
				className={className}
				icon={icon}
				isPrimary={isPrimary}
				isDisabled={isDisabled}
				onClick={handleClick}
			>
				{children}
			</Button>
			<input
				type="file"
				onChange={handleChange}
				ref={hiddenFileInput}
				style={{ display: 'none' }}
			/>
		</>
	);
};

export default ButtonAttachFile;
