'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Comment {
  id: string
  postId: string
  author: string
  content: string
  likes?: number
  hearts?: number
  createdAt: string
}


export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [filterPostId, setFilterPostId] = useState<string>('all')

  // Form State
  const [postId, setPostId] = useState('post-1')
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  // Feedback State
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // 1. READ: ดึงข้อมูลความคิดเห็น
  const fetchComments = async (selectedPostId?: string) => {
    setLoading(true)
    try {
      const targetPostId = selectedPostId !== undefined ? selectedPostId : filterPostId
      const url = targetPostId && targetPostId !== 'all' 
        ? `/api/comments?postId=${targetPostId}` 
        : '/api/comments'

      const res = await fetch(url)
      const data = await res.json()
      if (res.ok) {
        setComments(data.comments || [])
      } else {
        setError(data.error || 'ไม่สามารถโหลดข้อมูลได้')
      }
    } catch (err) {
      console.error(err)
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [])

  const handleFilterChange = (newPostId: string) => {
    setFilterPostId(newPostId)
    fetchComments(newPostId)
  }

  // 2. CREATE: เพิ่มความคิดเห็นใหม่
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          author,
          content,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'เกิดข้อผิดพลาดในการสร้างความคิดเห็น')
      }

      setSuccess('บันทึกความคิดเห็นใหม่ลงใน PostgreSQL เรียบร้อยแล้ว! ✨')
      setAuthor('')
      setContent('')
      fetchComments()

      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message)
    }
  }

  // 3. UPDATE: แก้ไขความคิดเห็น
  const handleUpdate = async (id: string) => {
    setError('')
    setSuccess('')
    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'เกิดข้อผิดพลาดในการแก้ไข')
      }

      setSuccess('อัปเดตข้อมูลในฐานข้อมูลสำเร็จ! 📝')
      setEditingId(null)
      setEditContent('')
      fetchComments()

      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message)
    }
  }

  // 5. REACTION: กด Reaction อีโมจิ (Workshop Week 11)
  const handleReact = async (id: string, type: 'like' | 'heart') => {
    try {
      const res = await fetch(`/api/comments/${id}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      })
      if (res.ok) {
        fetchComments()
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 4. DELETE: ลบความคิดเห็น
  const handleDelete = async (id: string) => {

    if (!confirm('คุณต้องการลบความคิดเห็นนี้จากฐานข้อมูล PostgreSQL หรือไม่?')) return

    setError('')
    setSuccess('')
    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'เกิดข้อผิดพลาดในการลบ')
      }

      setSuccess('ลบความคิดเห็นออกจากฐานข้อมูลเรียบร้อย! 🗑️')
      fetchComments()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header & Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/"
          className="text-slate-600 hover:text-slate-900 text-sm font-medium flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"
        >
          ← กลับหน้าแรก
        </Link>
        <span className="bg-purple-100 text-purple-700 font-semibold text-xs px-3 py-1 rounded-full border border-purple-200">
          Workshop (Prisma + PostgreSQL DB)
        </span>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 mb-2 flex items-center gap-2">
          💬 ระบบจัดการความคิดเห็น (Comments CRUD)
        </h1>
        <p className="text-slate-500 text-sm mb-6">
          ระบบบริหารจัดการข้อมูลความคิดเห็นแบบเรียลไทม์ เชื่อมต่อกับฐานข้อมูล PostgreSQL ผ่าน Prisma ORM
        </p>

        {/* Status Messages */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-4 text-sm font-medium flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl mb-4 text-sm font-medium flex items-center gap-2">
            <span>✅</span> {success}
          </div>
        )}

        {/* ฟอร์มสร้างความคิดเห็น (CREATE) */}
        <form onSubmit={handleSubmit} className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 mb-8">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-1.5">
            <span>➕</span> เพิ่มความคิดเห็นใหม่ (POST)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">หมวดหมู่โพสต์ (postId)</label>
              <select
                value={postId}
                onChange={(e) => setPostId(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="post-1">post-1 (บทความเทคโนโลยี)</option>
                <option value="post-2">post-2 (บทความการเรียน)</option>
                <option value="post-3">post-3 (พูดคุยทั่วไป)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">ชื่อผู้เขียน (author)</label>
              <input
                type="text"
                placeholder="ระบุชื่อของคุณ..."
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-600 mb-1">ข้อความความคิดเห็น (content)</label>
            <textarea
              placeholder="พิมพ์ข้อความของคุณที่นี่..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={3}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium text-sm transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
          >
            <span>🚀</span> บันทึกลง PostgreSQL DB
          </button>
        </form>

        {/* ส่วนแสดงผลและกรองข้อมูล (READ, UPDATE, DELETE) */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              📋 รายการความคิดเห็นทั้งหมด ({comments.length})
            </h2>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">กรองตาม Post ID:</span>
              <select
                value={filterPostId}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="p-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="all">ทั้งหมด (All)</option>
                <option value="post-1">post-1</option>
                <option value="post-2">post-2</option>
                <option value="post-3">post-3</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10 text-slate-400 font-medium">กำลังโหลดข้อมูลจาก PostgreSQL...</div>
          ) : comments.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-400 text-sm">
              ยังไม่มีความคิดเห็นในหมวดหมู่นี้
            </div>
          ) : (
            <div className="grid gap-4">
              {comments.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:border-purple-300 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-sm">{item.author}</span>
                      <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-md font-mono">
                        {item.postId}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">
                      {new Date(item.createdAt).toLocaleString('th-TH')}
                    </span>
                  </div>

                  {editingId === item.id ? (
                    /* UPDATE Mode */
                    <div className="mt-3 bg-purple-50/50 p-3 rounded-xl border border-purple-100">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={2}
                        className="w-full p-2 bg-white border border-purple-200 rounded-lg text-sm mb-2 focus:ring-2 focus:ring-purple-500 outline-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(item.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-all"
                        >
                          💾 ยืนยันบันทึก
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1.5 bg-slate-300 hover:bg-slate-400 text-slate-700 text-xs font-semibold rounded-lg transition-all"
                        >
                          ยกเลิก
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Display Mode */
                    <>
                      <p className="text-slate-700 text-sm leading-relaxed mb-3">{item.content}</p>

                      {/* Reaction Buttons (Workshop Week 11) */}
                      <div className="flex items-center gap-2 mb-3">
                        <button
                          onClick={() => handleReact(item.id, 'like')}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 rounded-lg text-xs font-medium transition-all flex items-center gap-1 active:scale-95"
                        >
                          👍 <span>{item.likes || 0}</span>
                        </button>
                        <button
                          onClick={() => handleReact(item.id, 'heart')}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 rounded-lg text-xs font-medium transition-all flex items-center gap-1 active:scale-95"
                        >
                          ❤️ <span>{item.hearts || 0}</span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-3">

                        <span className="text-[10px] text-slate-400 font-mono">ID: {item.id}</span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setEditingId(item.id)
                              setEditContent(item.content)
                            }}
                            className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-1"
                          >
                            ✏️ แก้ไข (PATCH)
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors flex items-center gap-1"
                          >
                            🗑️ ลบ (DELETE)
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}