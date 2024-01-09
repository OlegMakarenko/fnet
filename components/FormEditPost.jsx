
import { useEffect, useState } from 'react';
import Modal from './Modal';
import dynamic from 'next/dynamic';
import TextBox from './TextBox';
import Field from './Field';
import { MESSAGE_TYPES } from '@/constants';
import { FormTransaction } from './FormTransaction';

export const FormEditPost = ({ isVisible, onClose, postAccount, post, author}) => {
	const [title, setTitle] = useState('');
	const [text, setText] = useState('');
	const data = { title, text };

	useEffect(() => {
		setTitle(post.title);
		setText(post.text);
	}, [isVisible, post, postAccount]);


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
