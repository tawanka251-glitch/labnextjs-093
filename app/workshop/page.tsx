'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ExternalItem } from '@/lib/external';

export default function WorkshopPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // W.3: อ่าน ค่าเริ่มต้นจาก URL Query Parameters
    const initialSource = searchParams.get('source') === 'news' ? 'news' : 'products';
    const initialQuery = searchParams.get('q') ?? '';

    const [source, setSource] = useState<'products' | 'news'>(initialSource);
    const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
    const [items, setItems] = useState<ExternalItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // W.2: State สำหรับเปิดดูรายละเอียดแบบ Modal (ไม่ Reload หน้าเว็บ)
    const [selectedItem, setSelectedItem] = useState<ExternalItem | null>(null);

    // Fetch ข้อมูลเมื่อ source เปลี่ยน
    useEffect(() => {
        setIsLoading(true);
        setError(null);
        fetch(`/api/custom-workshop?source=${source}`)
            .then((r) => r.json())
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setItems(data.external || []);
                }
                setIsLoading(false);
            })
            .catch(() => {
                setError('ไม่สามารถเชื่อมต่อกับ API ได้');
                setIsLoading(false);
            });
    }, [source]);

    // W.3: ฟังก์ชัน Sync State ขึ้น URL
    function updateUrlParams(newSource: 'products' | 'news', newQuery: string) {
        const params = new URLSearchParams();
        params.set('source', newSource);
        if (newQuery) params.set('q', newQuery);
        router.replace(`/workshop?${params.toString()}`);
    }

    function handleTabChange(s: 'products' | 'news') {
        setSource(s);
        updateUrlParams(s, searchQuery);
    }

    function handleSearchChange(q: string) {
        setSearchQuery(q);
        updateUrlParams(source, q);
    }

    // W.1: กรองข้อมูล Real-time ฝั่ง Client (ไม่มี Request เพิ่มเติม)
    const filteredItems = items.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <main className="p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800">🚀 Workshop: Custom SPA Aggregator</h1>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-semibold">
                    SPA (No Reload)
                </span>
            </div>

            {/* ปุ่มเปลี่ยน Tab */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => handleTabChange('products')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${source === 'products' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                >
                    📦 สินค้า (Products)
                </button>
                <button
                    onClick={() => handleTabChange('news')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${source === 'news' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                >
                    📰 ข่าวสาร (News)
                </button>
            </div>

            {/* W.1: กล่องค้นหา Real-time */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="🔍 พิมพ์คำเพื่อค้นหาทันที..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {/* W.4: แสดง Loading / Error / Empty States */}
            {isLoading ? (
                <div className="p-12 text-center text-slate-400">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent mb-2"></div>
                    <p>กำลังโหลดข้อมูล...</p>
                </div>
            ) : error ? (
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">{error}</div>
            ) : filteredItems.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 border rounded-lg text-slate-500">
                    ไม่พบรายการที่ตรงกับคำค้นหา "{searchQuery}"
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setSelectedItem(item)}
                            className="p-4 bg-white border rounded-xl shadow-sm hover:shadow-md hover:border-indigo-400 transition cursor-pointer flex flex-col justify-between"
                        >
                            <div>
                                {item.image && (
                                    <img src={item.image} alt={item.title} className="w-full h-36 object-contain mb-3" />
                                )}
                                <h2 className="font-bold text-slate-800 line-clamp-2">{item.title}</h2>
                                <p className="text-sm text-slate-500 mt-1">{item.subtitle}</p>
                            </div>
                            <span className="text-xs text-indigo-600 font-semibold mt-3 text-right">
                                คลิกเพื่อดูรายละเอียด ➔
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* W.2: Modal แสดงรายละเอียด (ไม่ Reload หน้า) */}
            {selectedItem && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-150">
                        <h2 className="text-lg font-bold text-slate-900 mb-2">{selectedItem.title}</h2>
                        {selectedItem.image && (
                            <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-48 object-contain my-3" />
                        )}
                        <div className="bg-slate-50 p-3 rounded-lg mb-4 text-sm text-slate-600">
                            {selectedItem.subtitle}
                        </div>
                        <button
                            onClick={() => setSelectedItem(null)}
                            className="w-full bg-slate-800 text-white py-2 rounded-lg font-medium hover:bg-slate-900 transition"
                        >
                            ปิดหน้าต่าง
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}