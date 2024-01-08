
import { useEffect, useState } from 'react';
import Modal from './Modal';
import Avatar from './Avatar';
import rehypeSanitize from 'rehype-sanitize';
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from 'next/dynamic';
import TextBox from './TextBox';
import Field from './Field';
import { MESSAGE_TYPES } from '@/constants';
import { FormTransaction } from './FormTransaction';

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);
const EditerMarkdown = dynamic(
  () =>
    import("@uiw/react-md-editor").then((mod) => {
      return mod.default.Markdown;
    }),
  { ssr: false }
);

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
