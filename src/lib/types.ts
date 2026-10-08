export type MascotState = 'sleeping' | 'happy' | 'curious' | 'thinking' | 'excited' | 'neutral';
export interface Profile { id: string; name: string; email: string; }
export interface Trip { id: string; destination: string; subtitle: string; date: string; start: string; end: string; cover: string; photoCount: number; members: string[]; }
export interface Photo { id: string; tripId: string; url: string; caption: string; }
export interface ChatEntry { id: string; sender: string; role: 'user' | 'assistant'; text: string; time: string; attachment?: string; }
export interface GhoomiRequest { user_id: string; group_id: string | null; message: string; context: { page: string; attachments?: string[] }; }
export interface GhoomiResponse { message: string; reaction?: Exclude<MascotState, 'sleeping'>; }
