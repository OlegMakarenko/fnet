
import { useEffect, useState } from 'react';
import Modal from './Modal';
import TextBox from './TextBox';
import Field from './Field';
import { MESSAGE_TYPES } from '@/constants';
import { FormTransaction } from './FormTransaction';

export const FormAccountName = ({ isVisible, onClose, currentBio, currentName}) => {
	const [name, setName] = useState('');
	const [bio, setBio] = useState('');
	const data = { currentName, name, currentBio, bio };

	useEffect(() => {
		setName(currentName);
		setBio(currentBio);
	}, [currentName, currentBio, isVisible]);

	return (
		<Modal isVisible={isVisible} onClose={onClose}>
			<FormTransaction type={MESSAGE_TYPES.ACCOUNT_NAME} data={data} onClose={onClose}>
				<Field title="Name">
					<TextBox value={name} onChange={setName} />
				</Field>
				<Field title="Bio">
					<TextBox
						value={bio}
						onChange={setBio}
						isMultiline
						errorMessage={bio.length > 128 ? 'Too many characters' : ''}
					/>
				</Field>
			</FormTransaction>
		</Modal>
	);
};
