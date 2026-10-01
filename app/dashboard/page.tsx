'use client';

import { useEffect, useState } from 'react';

type ContactMessage = {
    id: string;
    name: string;
    email: string;
    message: string;
    createdAt: string;
};

export default function DashboardPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');

    const loadMessages = async () => {
        try {
            const res = await fetch('/api/contact', { cache: 'no-store' });
            if (!res.ok) {
                setMessages([]);
                return;
            }
            const data = await res.json();
            if (Array.isArray(data)) setMessages(data);
            else if (Array.isArray(data.messages)) setMessages(data.messages);
            else setMessages([]);
        } catch (error) {
            console.error('Failed to load messages:', error);
            setMessages([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMessages();
        const handleUpdated = () => loadMessages();
        window.addEventListener('contact:updated', handleUpdated);
        return () => window.removeEventListener('contact:updated', handleUpdated);
    }, []);

    // ฟังก์ชันลบข้อความ (ยิงไปที่ /api/messages/[id])
    const handleDelete = async (id: string) => {
        if (!confirm('คุณต้องการลบข้อความนี้ใช่หรือไม่?')) return;
        try {
            const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
            if (res.ok) {
                loadMessages();
            } else {
                const data = await res.json();
                alert(`ลบไม่สำเร็จ: ${data.error || 'ไม่มีสิทธิ์ลบข้อความนี้'}`);
            }
        } catch {
            alert('เกิดข้อผิดพลาดในการลบข้อความ');
        }
    };

    // เริ่มการแก้ไข
    const handleStartEdit = (msg: ContactMessage) => {
        setEditingId(msg.id);
        setEditContent(msg.message);
    };

    // บันทึกการแก้ไข (ยิงไปที่ /api/messages/[id])
    const handleSaveEdit = async (id: string) => {
        try {
            const res = await fetch(`/api/messages/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: editContent }),
            });

            if (res.ok) {
                setEditingId(null);
                loadMessages();
            } else {
                const data = await res.json();
                alert(`แก้ไขไม่สำเร็จ: ${data.error || 'ไม่มีสิทธิ์แก้ไขข้อความนี้'}`);
            }
        } catch {
            alert('เกิดข้อผิดพลาดในการแก้ไขข้อความ');
        }
    };

    return (
        <main className="p-8">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <form action="/api/logout" method="POST">
                    <button
                        type="submit"
                        className="rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition-colors"
                    >
                        Logout
                    </button>
                </form>
            </div>

            <p className="mb-6">จำนวนข้อความที่ได้รับ: {Array.isArray(messages) ? messages.length : 0}</p>

            {loading ? (
                <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
            ) : !Array.isArray(messages) || messages.length === 0 ? (
                <p className="text-gray-500">ยังไม่มีข้อความติดต่อ</p>
            ) : (
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div key={message.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                            <div className="mb-2 flex items-center justify-between">
                                <h2 className="font-semibold text-slate-800">{message.name}</h2>
                                <span className="text-sm text-gray-500">
                                    {message.createdAt ? new Date(message.createdAt).toLocaleString('th-TH') : ''}
                                </span>
                            </div>
                            <p className="text-sm text-blue-600">{message.email}</p>

                            {/* ส่วนแก้ไข / แสดงผลข้อความ */}
                            {editingId === message.id ? (
                                <div className="mt-3 space-y-2">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="w-full border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleSaveEdit(message.id)}
                                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                                        >
                                            บันทึก
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400 transition-colors"
                                        >
                                            ยกเลิก
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="mt-2 text-sm text-slate-700">{message.message}</p>
                                    <div className="mt-4 flex gap-2 justify-end border-t pt-2">
                                        <button
                                            onClick={() => handleStartEdit(message)}
                                            className="bg-amber-500 text-white px-3 py-1 rounded text-xs hover:bg-amber-600 transition-colors"
                                        >
                                            แก้ไข
                                        </button>
                                        <button
                                            onClick={() => handleDelete(message.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                                        >
                                            ลบ
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}