
import { useEffect, useState } from 'react';
import Modal from './Modal';
import TextBox from './TextBox';
import Field from './Field';
import { MESSAGE_TYPES } from '@/constants';
import { FormTransaction } from './FormTransaction';

export const FormAccountName = ({ isVisible, onClose, currentName}) => {
	const [name, setName] = useState('');
	const data = { currentName, name };

	useEffect(() => {
		setName('');
	}, [isVisible]);


	return (
		<Modal isVisible={isVisible} onClose={onClose}>
			<FormTransaction type={MESSAGE_TYPES.ACCOUNT_NAME} data={data} onClose={onClose}>
				<Field title="Name">
					<TextBox value={name} onChange={setName} />
				</Field>
			</FormTransaction>
		</Modal>
	);
};
