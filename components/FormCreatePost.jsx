
import { useEffect, useState } from 'react';
import Modal from './Modal';
import TextBox from './TextBox';
import Field from './Field';
import { MESSAGE_TYPES } from '@/constants';
import { FormTransaction } from './FormTransaction';
import { createAccount } from '@/utils';

export const FormCreatePost = ({ isVisible, onClose}) => {
	const [postAccount, setPostAccount] = useState('');
	const [title, setTitle] = useState('');
	const [text, setText] = useState('');
	const data = { title, text };

	useEffect(() => {
		setPostAccount(createAccount())
		setTitle('');
		setText('');
	}, [isVisible]);

	return (
		<Modal isVisible={isVisible} onClose={onClose}>
			<FormTransaction type={MESSAGE_TYPES.POST} postAccount={postAccount} data={data} onClose={onClose}>
				<Field title="Title">
					<TextBox value={title} onChange={setTitle} />
				</Field>
				<Field title="Content">
					<TextBox
						value={text}
						onChange={setText}
						isMultiline
					/>
				</Field>
			</FormTransaction>
		</Modal>
	);
};
