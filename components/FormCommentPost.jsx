
import { useEffect, useState } from 'react';
import Modal from './Modal';
import TextBox from './TextBox';
import Field from './Field';
import { MESSAGE_TYPES } from '@/constants';
import { FormTransaction } from './FormTransaction';

export const FormCommentPost = ({ isVisible, postAccount, onClose}) => {
	const [text, setText] = useState('');
	const data = { text };

	useEffect(() => {
		setText('');
	}, [isVisible]);

	return (
		<Modal isVisible={isVisible} onClose={onClose}>
			<FormTransaction type={MESSAGE_TYPES.COMMENT} postAccount={postAccount} data={data} onClose={onClose}>
				<TextBox
					value={text}
					onChange={setText}
					isMultiline
					isLarge
				/>
			</FormTransaction>
		</Modal>
	);
};
