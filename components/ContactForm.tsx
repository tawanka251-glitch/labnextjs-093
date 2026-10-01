'use client'; // ← บรรทัดแรกเสมอ
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ContactForm() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

    function validate() {
        if (name.trim().length < 2) return 'กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร';
        if (!email.includes('@')) return 'อีเมลไม่ถูกต้อง';
        if (message.trim().length < 5) return 'ข้อความสั้นเกินไป';
        return '';
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const msg = validate();
        if (msg) {
            setError(msg);
            return;
        }
        setError('');
        setStatus('sending');

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message }),
            });

            const data = await res.json();

            if (!res.ok) {
                setStatus('error');
                setError(data.error || 'ส่งไม่สำเร็จ ลองใหม่อีกครั้ง');
                return;
            }

            setStatus('success');
            setName('');
            setEmail('');
            setMessage('');
            window.dispatchEvent(new Event('contact:updated'));

            // นำทางไปยังหน้า Dashboard หลังส่งสำเร็จ
            router.push('/dashboard');
        } catch (err) {
            setStatus('error');
            setError('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
        }
    }

    const isValid =
        name.trim().length >= 2 &&
        email.includes('@') &&
        message.trim().length >= 5;

    return (
        <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
            <input value={name} onChange={(e) => setName(e.target.value)}
                placeholder="ชื่อ" className="border p-2 w-full rounded" />
            <input value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="อีเมล" className="border p-2 w-full rounded" />
            <textarea value={message} onChange={(e) => setMessage(e.target.value)}
                placeholder="ข้อความ" className="border p-2 w-full rounded" />

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {status === 'sending' && <p className="text-gray-400 text-sm">กำลังส่ง...</p>}
            {status === 'success' && <p className="text-green-600 text-sm">ส่งสำเร็จ ขอบคุณครับ/ค่ะ!</p>}

            <button
                type="submit"
                disabled={!isValid || status === 'sending'}
                className={isValid ? 'bg-blue-600 text-white px-4 py-2 rounded' : 'bg-gray-300 text-gray-700 px-4 py-2 rounded'}
            >
                {status === 'sending' ? 'กำลังส่ง...' : 'ส่งข้อความ'}
            </button>
        </form>
    );
}