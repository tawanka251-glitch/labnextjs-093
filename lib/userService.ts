import bcrypt from 'bcrypt'
import { ZodError } from 'zod'
import { changePasswordSchema } from './schemas'
import { findUserById, updateUserPassword } from './users'
import { ForbiddenError } from './errors'

export async function changePassword(sessionUserId: string | undefined, rawData: unknown) {
    // 1. ตรวจสอบว่าผู้ใช้ Login อยู่หรือไม่ (Authorization Check)
    if (!sessionUserId) {
        throw new ForbiddenError('กรุณาเข้าสู่ระบบก่อนทำรายการ')
    }

    // 2. Validate ข้อมูลด้วย Zod
    let data
    try {
        data = changePasswordSchema.parse(rawData)
    } catch (err) {
        if (err instanceof ZodError) {
            throw new Error(err.issues[0].message)
        }
        throw err
    }

    // 3. ดึงข้อมูลผู้ใช้จาก Session ID
    const user = await findUserById(sessionUserId)
    if (!user) {
        throw new Error('ไม่พบข้อมูลผู้ใช้')
    }

    // 4. ตรวจสอบ oldPassword ด้วย bcrypt.compare
    const isMatch = await bcrypt.compare(data.oldPassword, user.password)
    if (!isMatch) {
        throw new Error('รหัสผ่านเดิมไม่ถูกต้อง')
    }

    // 5. บันทึกรหัสผ่านใหม่ (ผ่าน bcrypt.hash ใน updateUserPassword)
    await updateUserPassword(user.id, data.newPassword)
    return { ok: true }
}