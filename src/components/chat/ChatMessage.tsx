import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message';
import type { ChatEntry } from '@/lib/types';
import awake from '@/assets/ghoomi-awake.png';
export function ChatMessage({ entry, currentUser }: { entry: ChatEntry; currentUser: string }) {
 const own = entry.sender === currentUser;
 return <Message from={entry.role === 'assistant' ? 'assistant' : own ? 'user' : 'assistant'} className="chat-entry"><div className={`chat-sender ${own ? 'justify-end' : ''}`}>{entry.sender === 'Ghoomi' ? <img src={awake} alt="" /> : <span className="small-avatar">{entry.sender[0]}</span>}<strong>{entry.sender}</strong><span>{entry.time}</span></div><MessageContent className={own ? 'own-message' : 'other-message'}><MessageResponse>{entry.text}</MessageResponse>{entry.attachment && <img className="max-h-40 rounded-md object-cover" src={entry.attachment} alt="Shared photo" />}</MessageContent></Message>;
}
